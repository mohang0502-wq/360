import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import pool from './db.js';
import { requireAuth, signToken, upload, UPLOAD_DIR } from './middleware.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));

const LEGACY_ADMIN_HASH = '$2a$10$ZqaAh8Qu.Dk.xwrFozBmNumkR.Pn7HTPyAdYmUtMMfnHYNjYH1Bgy';
const DEFAULT_ADMIN_USERNAME = 'admin@360.com';
const DEFAULT_ADMIN_PASSWORD = 'Admin@360#';
const ok = (res, data) => res.json(data);
const fail = (res, code, message, error) => res.status(code).json({ message, error: error ? String(error) : undefined });
const parseJsonColumn = (value, fallback) => {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};
const mailTransport = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
    })
  : null;

/* ---------------------------- health & auth ---------------------------- */

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    ok(res, { ok: true, status: 'mysql-connected' });
  } catch (error) {
    fail(res, 500, 'MySQL connection failed', error);
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return fail(res, 400, 'Username and password required.');

  try {
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE username = ?', [username]);
    const user = rows[0];
    if (!user) return fail(res, 401, 'Invalid credentials.');

    let validPassword = await bcrypt.compare(password, user.password_hash);

    const legacyAdminUser = user.username === DEFAULT_ADMIN_USERNAME || user.username === 'admin';
    if (
      !validPassword &&
      legacyAdminUser &&
      (password === DEFAULT_ADMIN_PASSWORD || password === 'admin123') &&
      user.password_hash === LEGACY_ADMIN_HASH
    ) {
      const newHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
      await pool.query('UPDATE admin_users SET username = ?, password_hash = ? WHERE id = ?', [DEFAULT_ADMIN_USERNAME, newHash, user.id]);
      user.username = DEFAULT_ADMIN_USERNAME;
      validPassword = true;
    }

    if (!validPassword) return fail(res, 401, 'Invalid credentials.');

    const token = signToken(user);
    ok(res, { ok: true, token, user: { username: user.username, role: user.role } });
  } catch (error) {
    fail(res, 500, 'Login failed', error);
  }
});

app.post('/api/admin/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return fail(res, 400, 'Both current and new password required.');

  try {
    const [rows] = req.admin.id
      ? await pool.query('SELECT * FROM admin_users WHERE id = ?', [req.admin.id])
      : await pool.query('SELECT * FROM admin_users WHERE username = ?', [req.admin.username]);
    const user = rows[0];
    if (!user) return fail(res, 401, 'Admin account not found. Please log in again.');
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!validPassword) return fail(res, 401, 'Current password is incorrect.');

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [newHash, user.id]);
    ok(res, { ok: true });
  } catch (error) {
    fail(res, 500, 'Failed to change password', error);
  }
});

/* ------------------------------ site settings --------------------------- */

app.get('/api/site', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM site_settings ORDER BY id DESC LIMIT 1');
    ok(res, rows[0] || {});
  } catch (error) {
    fail(res, 500, 'Failed to fetch site settings', error);
  }
});

app.put('/api/site', requireAuth, async (req, res) => {
  const { site_name, tagline, phone, email, whatsapp, address, facebook, instagram, linkedin, youtube, logo_url, favicon_url } = req.body || {};
  try {
    const [rows] = await pool.query('SELECT id FROM site_settings ORDER BY id DESC LIMIT 1');
    if (rows[0]) {
      await pool.query(
        'UPDATE site_settings SET site_name=?, tagline=?, phone=?, email=?, whatsapp=?, address=?, facebook=?, instagram=?, linkedin=?, youtube=?, logo_url=?, favicon_url=? WHERE id=?',
        [site_name, tagline, phone, email, whatsapp, address, facebook, instagram, linkedin, youtube, logo_url, favicon_url, rows[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO site_settings (site_name, tagline, phone, email, whatsapp, address, facebook, instagram, linkedin, youtube, logo_url, favicon_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [site_name, tagline, phone, email, whatsapp, address, facebook, instagram, linkedin, youtube, logo_url, favicon_url]
      );
    }
    ok(res, { ok: true });
  } catch (error) {
    fail(res, 500, 'Failed to update site settings', error);
  }
});

/* --------------------------- contact submissions ------------------------- */

app.post('/api/contact', async (req, res) => {
  const { name, email, company, phone, service, message } = req.body || {};
  if (!name || !email || !message) return fail(res, 400, 'Name, email and message are required.');

  try {
    const [result] = await pool.query(
      'INSERT INTO contact_submissions (name, email, company, phone, service, message) VALUES (?,?,?,?,?,?)',
      [name.trim(), email.trim(), company?.trim() || null, phone?.trim() || null, service?.trim() || null, message.trim()]
    );

    let mailSent = false;
    if (mailTransport && process.env.SMTP_FROM && process.env.CONTACT_TO) {
      await mailTransport.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.CONTACT_TO,
        replyTo: email,
        subject: `New website enquiry from ${name}`,
        text: [`Name: ${name}`, `Email: ${email}`, `Company: ${company || '-'}`, `Phone: ${phone || '-'}`, `Service: ${service || '-'}`, '', message].join('\n'),
      });
      mailSent = true;
    }
    ok(res, { ok: true, id: result.insertId, mailSent });
  } catch (error) {
    fail(res, 500, 'Failed to submit your message', error);
  }
});

app.get('/api/contact-submissions', requireAuth, async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC, id DESC');
    ok(res, rows);
  } catch (error) {
    fail(res, 500, 'Failed to fetch contact submissions', error);
  }
});

app.put('/api/contact-submissions/:id', requireAuth, async (req, res) => {
  const { status, admin_notes } = req.body || {};
  if (!['new', 'read', 'replied', 'archived'].includes(status)) return fail(res, 400, 'Invalid submission status.');
  try {
    await pool.query('UPDATE contact_submissions SET status=?, admin_notes=? WHERE id=?', [status, admin_notes || null, req.params.id]);
    ok(res, { ok: true });
  } catch (error) {
    fail(res, 500, 'Failed to update contact submission', error);
  }
});

/* ------------------------------ page sections ---------------------------- */
/* Generic content blocks: GET is public (site rendering), writes need auth. */

app.get('/api/sections', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM page_sections ORDER BY page_key, sort_order, id');
    ok(res, rows.map((row) => ({ ...row, content_json: parseJsonColumn(row.content_json, {}) })));
  } catch (error) {
    fail(res, 500, 'Failed to fetch sections', error);
  }
});

app.get('/api/sections/:page', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM page_sections WHERE page_key = ? ORDER BY sort_order, id',
      [req.params.page]
    );
    ok(res, rows.map((row) => ({ ...row, content_json: parseJsonColumn(row.content_json, {}) })));
  } catch (error) {
    fail(res, 500, 'Failed to fetch page sections', error);
  }
});

// Upsert a single section's content (create if new, else update).
app.put('/api/sections/:page/:section', requireAuth, async (req, res) => {
  const { page, section } = req.params;
  const { content, title, sort_order } = req.body || {};
  if (content === undefined) return fail(res, 400, 'content is required.');

  try {
    await pool.query(
      `INSERT INTO page_sections (page_key, section_key, title, content_json, sort_order)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), content_json=VALUES(content_json), sort_order=VALUES(sort_order)`,
      [page, section, title || null, JSON.stringify(content), sort_order || 0]
    );
    ok(res, { ok: true });
  } catch (error) {
    fail(res, 500, 'Failed to save section', error);
  }
});

app.delete('/api/sections/:page/:section', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM page_sections WHERE page_key=? AND section_key=?', [req.params.page, req.params.section]);
    ok(res, { ok: true });
  } catch (error) {
    fail(res, 500, 'Failed to delete section', error);
  }
});

/* -------------------------------- categories ------------------------------ */

app.get('/api/categories', async (req, res) => {
  const { group } = req.query;
  try {
    const [rows] = group
      ? await pool.query('SELECT c.*, p.name AS parent_name FROM categories c LEFT JOIN categories p ON p.id=c.parent_id WHERE c.group_type=? ORDER BY c.parent_id IS NOT NULL, c.sort_order, c.id', [group])
      : await pool.query('SELECT c.*, p.name AS parent_n  ame FROM categories c LEFT JOIN categories p ON p.id=c.parent_id ORDER BY c.group_type, c.parent_id IS NOT NULL, c.sort_order, c.id');
    ok(res, rows);
  } catch (error) {
    fail(res, 500, 'Failed to fetch categories', error);
  }
});

app.post('/api/categories', requireAuth, async (req, res) => {
  const { group_type, name, slug, parent_id, sort_order } = req.body || {};
  if (!group_type || !name || !slug) return fail(res, 400, 'group_type, name and slug are required.');
  try {
    const [result] = await pool.query(
      'INSERT INTO categories (group_type, name, slug, parent_id, sort_order) VALUES (?,?,?,?,?)',
      [group_type, name, slug, parent_id || null, sort_order || 0]
    );
    ok(res, { ok: true, id: result.insertId });
  } catch (error) {
    fail(res, 500, 'Failed to create category', error);
  }
});

app.put('/api/categories/:id', requireAuth, async (req, res) => {
  const { name, slug, parent_id, sort_order } = req.body || {};
  try {
    await pool.query('UPDATE categories SET name=?, slug=?, parent_id=?, sort_order=? WHERE id=?', [name, slug, parent_id || null, sort_order || 0, req.params.id]);
    ok(res, { ok: true });
  } catch (error) {
    fail(res, 500, 'Failed to update category', error);
  }
});

app.delete('/api/categories/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id=?', [req.params.id]);
    ok(res, { ok: true });
  } catch (error) {
    fail(res, 500, 'Failed to delete category', error);
  }
});

/* -------------------------------- services -------------------------------- */

app.get('/api/services', async (req, res) => {
  const { type } = req.query;
  try {
    const [rows] = type
      ? await pool.query('SELECT s.*, c.name AS category_name FROM services s LEFT JOIN categories c ON c.id=s.category_id WHERE s.type=? ORDER BY s.sort_order, s.id', [type])
      : await pool.query('SELECT s.*, c.name AS category_name FROM services s LEFT JOIN categories c ON c.id=s.category_id ORDER BY s.type, s.sort_order, s.id');
    ok(res, rows.map((row) => ({ ...row, items_json: parseJsonColumn(row.items_json, []) })));
  } catch (error) {
    fail(res, 500, 'Failed to fetch services', error);
  }
});

app.post('/api/services', requireAuth, async (req, res) => {
  const { type, category_id, title, description, image_url, items, sort_order } = req.body || {};
  if (!type || !title) return fail(res, 400, 'type and title are required.');
  try {
    const [result] = await pool.query(
      'INSERT INTO services (type, category_id, title, description, image_url, items_json, sort_order) VALUES (?,?,?,?,?,?,?)',
      [type, category_id || null, title, description || '', image_url || '', JSON.stringify(items || []), sort_order || 0]
    );
    ok(res, { ok: true, id: result.insertId });
  } catch (error) {
    fail(res, 500, 'Failed to create service', error);
  }
});

app.put('/api/services/:id', requireAuth, async (req, res) => {
  const { category_id, title, description, image_url, items, sort_order } = req.body || {};
  try {
    await pool.query(
      'UPDATE services SET category_id=?, title=?, description=?, image_url=?, items_json=?, sort_order=? WHERE id=?',
      [category_id || null, title, description || '', image_url || '', JSON.stringify(items || []), sort_order || 0, req.params.id]
    );
    ok(res, { ok: true });
  } catch (error) {
    fail(res, 500, 'Failed to update service', error);
  }
});

app.delete('/api/services/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM services WHERE id=?', [req.params.id]);
    ok(res, { ok: true });
  } catch (error) {
    fail(res, 500, 'Failed to delete service', error);
  }
});

/* ------------------------------- portfolio -------------------------------- */

app.get('/api/portfolio', async (req, res) => {
  const { type, category_id } = req.query;
  try {
    let sql = 'SELECT p.*, c.name AS category_name, c.slug AS category_slug, parent.name AS parent_category_name FROM portfolio_items p LEFT JOIN categories c ON c.id = p.category_id LEFT JOIN categories parent ON parent.id = c.parent_id WHERE 1=1';
    const params = [];
    if (type) { sql += ' AND p.type=?'; params.push(type); }
    if (category_id) { sql += ' AND p.category_id=?'; params.push(category_id); }
    sql += ' ORDER BY p.sort_order, p.id';
    const [rows] = await pool.query(sql, params);
    ok(res, rows.map((row) => ({ ...row, category_name: row.parent_category_name ? `${row.parent_category_name} / ${row.category_name}` : row.category_name })));
  } catch (error) {
    fail(res, 500, 'Failed to fetch portfolio', error);
  }
});

app.post('/api/portfolio', requireAuth, async (req, res) => {
  const { type, category_id, caption, before_image, after_image, sort_order } = req.body || {};
  if (!type || !caption || !before_image || !after_image) {
    return fail(res, 400, 'type, caption, before_image and after_image are required.');
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO portfolio_items (type, category_id, caption, before_image, after_image, sort_order) VALUES (?,?,?,?,?,?)',
      [type, category_id || null, caption, before_image, after_image, sort_order || 0]
    );
    ok(res, { ok: true, id: result.insertId });
  } catch (error) {
    fail(res, 500, 'Failed to create portfolio item', error);
  }
});

app.put('/api/portfolio/:id', requireAuth, async (req, res) => {
  const { type, category_id, caption, before_image, after_image, sort_order } = req.body || {};
  try {
    await pool.query(
      'UPDATE portfolio_items SET type=?, category_id=?, caption=?, before_image=?, after_image=?, sort_order=? WHERE id=?',
      [type, category_id || null, caption, before_image, after_image, sort_order || 0, req.params.id]
    );
    ok(res, { ok: true });
  } catch (error) {
    fail(res, 500, 'Failed to update portfolio item', error);
  }
});

app.delete('/api/portfolio/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM portfolio_items WHERE id=?', [req.params.id]);
    ok(res, { ok: true });
  } catch (error) {
    fail(res, 500, 'Failed to delete portfolio item', error);
  }
});

/* --------------------------- media (image upload) ------------------------- */

app.get('/api/media', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM media ORDER BY id DESC');
    ok(res, rows);
  } catch (error) {
    fail(res, 500, 'Failed to fetch media', error);
  }
});

// Single image upload. Field name: "image". Returns the saved DB row + public URL.
app.post('/api/upload', requireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) return fail(res, 400, 'No image file uploaded (field name must be "image").');
  try {
    const url = `/uploads/${req.file.filename}`;
    const [result] = await pool.query(
      'INSERT INTO media (filename, original_name, url, alt_text) VALUES (?,?,?,?)',
      [req.file.filename, req.file.originalname, url, req.body.alt || '']
    );
    ok(res, { ok: true, id: result.insertId, url, filename: req.file.filename });
  } catch (error) {
    fail(res, 500, 'Failed to save upload', error);
  }
});

// Replace an existing image's file in place (same DB row, new file on disk).
app.put('/api/media/:id/replace', requireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) return fail(res, 400, 'No image file uploaded (field name must be "image").');
  try {
    const [rows] = await pool.query('SELECT * FROM media WHERE id=?', [req.params.id]);
    const existing = rows[0];
    if (!existing) return fail(res, 404, 'Media not found.');

    const oldPath = path.join(UPLOAD_DIR, existing.filename);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

    const url = `/uploads/${req.file.filename}`;
    await pool.query('UPDATE media SET filename=?, original_name=?, url=? WHERE id=?', [
      req.file.filename, req.file.originalname, url, req.params.id,
    ]);
    ok(res, { ok: true, url });
  } catch (error) {
    fail(res, 500, 'Failed to replace image', error);
  }
});

app.delete('/api/media/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM media WHERE id=?', [req.params.id]);
    const existing = rows[0];
    if (!existing) return fail(res, 404, 'Media not found.');

    const filePath = path.join(UPLOAD_DIR, existing.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query('DELETE FROM media WHERE id=?', [req.params.id]);
    ok(res, { ok: true });
  } catch (error) {
    fail(res, 500, 'Failed to delete media', error);
  }
});

/* ---------------------------------- errors --------------------------------- */

app.use((err, _req, res, _next) => {
  if (err) return fail(res, 400, err.message || 'Request failed');
  res.status(500).json({ message: 'Unknown error' });
});

app.listen(port, () => {
  console.log(`CMS API running on http://localhost:${port}`);
});
