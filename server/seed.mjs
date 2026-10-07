// One-time migration: pushes the existing hardcoded content from
// src/data/cms.ts into the database so nothing is lost when the
// site switches from static data to the CMS API.
//
// Run once after creating the schema:  npm run seed

import 'dotenv/config';
import pool from './db.js';
import { defaultCmsContent } from '../src/data/cms.ts';

async function upsertSection(page, section, content, sortOrder = 0) {
  await pool.query(
    `INSERT INTO page_sections (page_key, section_key, content_json, sort_order)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE content_json = VALUES(content_json)`,
    [page, section, JSON.stringify(content), sortOrder]
  );
}

async function getCategoryId(groupType, slug) {
  const [rows] = await pool.query('SELECT id FROM categories WHERE group_type=? AND slug=?', [groupType, slug]);
  return rows[0]?.id || null;
}

async function ensureCategory(groupType, name, sortOrder = 0) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  await pool.query(
    `INSERT INTO categories (group_type, name, slug, sort_order) VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE name=VALUES(name), sort_order=VALUES(sort_order)`,
    [groupType, name, slug, sortOrder]
  );
  return getCategoryId(groupType, slug);
}

async function seed() {
  const cms = defaultCmsContent;

  // site settings
  await pool.query(
    `UPDATE site_settings SET site_name=?, tagline=?, phone=?, email=? WHERE id = (SELECT id FROM (SELECT id FROM site_settings ORDER BY id DESC LIMIT 1) t)`,
    [cms.site.name, cms.site.tagline, cms.site.phone, cms.site.email]
  );

  // home page sections
  await upsertSection('home', 'hero', cms.home.hero, 1);
  await upsertSection('home', 'trust', cms.home.trust, 2);
  await upsertSection('home', 'coreServices', cms.home.coreServices, 3);
  await upsertSection('home', 'showcase', cms.home.showcase, 4);

  // services page top-level copy (manual/ai title+description+image+items live in `services` table below)
  await upsertSection('services', 'manual', {
    title: cms.services.manual.title,
    description: cms.services.manual.description,
    image: cms.services.manual.image,
    items: cms.services.manual.items,
  }, 1);
  await upsertSection('services', 'ai', {
    title: cms.services.ai.title,
    description: cms.services.ai.description,
    image: cms.services.ai.image,
    items: cms.services.ai.items,
  }, 2);

  // pricing & contact pages
  await upsertSection('pricing', 'main', cms.pricing, 1);
  await upsertSection('contact', 'main', cms.contact, 1);

  // service cards -> services table
  let sort = 0;
  for (const card of cms.services.manual.serviceCards || []) {
    sort += 1;
    const serviceCatId = await ensureCategory('service', card.title, sort);
    await pool.query(
      'INSERT INTO services (type, category_id, title, description, image_url, items_json, sort_order) VALUES (?,?,?,?,?,?,?)',
      ['manual', serviceCatId, card.title, card.description, card.image, JSON.stringify(card.applications || []), sort]
    );
  }
  sort = 0;
  for (const card of cms.services.ai.serviceCards || []) {
    sort += 1;
    const serviceCatId = await ensureCategory('service', card.title, sort);
    await pool.query(
      'INSERT INTO services (type, category_id, title, description, image_url, items_json, sort_order) VALUES (?,?,?,?,?,?,?)',
      ['ai', serviceCatId, card.title, card.description, card.image, JSON.stringify(card.use || []), sort]
    );
  }

  // portfolio galleries -> portfolio_items table
  sort = 0;
  for (const item of cms.portfolio.manualGallery || []) {
    sort += 1;
    const portfolioCatId = await ensureCategory('portfolio', item.category, sort);
    await pool.query(
      'INSERT INTO portfolio_items (type, category_id, caption, before_image, after_image, sort_order) VALUES (?,?,?,?,?,?)',
      ['manual', portfolioCatId, item.caption, item.before, item.after, sort]
    );
  }
  sort = 0;
  for (const item of cms.portfolio.aiGallery || []) {
    sort += 1;
    const portfolioCatId = await ensureCategory('portfolio', item.category, sort);
    await pool.query(
      'INSERT INTO portfolio_items (type, category_id, caption, before_image, after_image, sort_order) VALUES (?,?,?,?,?,?)',
      ['ai', portfolioCatId, item.caption, item.before, item.after, sort]
    );
  }

  console.log('Seed complete: home/services/pricing/contact sections + services + portfolio items inserted.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
