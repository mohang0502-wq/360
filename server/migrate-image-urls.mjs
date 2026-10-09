// One-off, idempotent cleanup of stored image URLs.
//  - "http(s)://<any host>/uploads/x.jpg"  -> "/uploads/x.jpg"
//  - "/images/Fashion%20%26%20Lifestyle/…" -> "/images/Fashion%20&%20Lifestyle/…"
// The frontend already normalises these at read time (src/services/cmsService.ts),
// so running this is optional but keeps the database clean.
// Usage: npm run migrate:image-urls   (add --dry to preview)
import 'dotenv/config';
import pool from './db.js';

const dry = process.argv.includes('--dry');
const UPLOAD_RE = /^(?:https?:\/\/[^/]+)?(\/uploads\/[^?#\s]+)$/i;
const LOCAL_ASSET_RE = /^\/(?:images|generated-images)\//i;

const clean = (s) => {
  const m = s.match(UPLOAD_RE);
  if (m) return m[1];
  if (LOCAL_ASSET_RE.test(s)) return s.replace(/%26/gi, '&');
  return s;
};
const deep = (v) => {
  if (typeof v === 'string') return clean(v);
  if (Array.isArray(v)) return v.map(deep);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x)]));
  return v;
};

let changed = 0;

const [sections] = await pool.query('SELECT id, content_json FROM page_sections');
for (const row of sections) {
  const json = typeof row.content_json === 'string' ? JSON.parse(row.content_json) : row.content_json;
  const next = deep(json);
  if (JSON.stringify(next) !== JSON.stringify(json)) {
    changed++;
    if (!dry) await pool.query('UPDATE page_sections SET content_json=? WHERE id=?', [JSON.stringify(next), row.id]);
  }
}

const columns = [
  ['services', ['image_url']],
  ['portfolio_items', ['before_image', 'after_image']],
  ['site_settings', ['logo_url', 'favicon_url']],
];
for (const [table, cols] of columns) {
  const [rows] = await pool.query(`SELECT id, ${cols.join(', ')} FROM ${table}`);
  for (const row of rows) {
    const updates = cols.filter((c) => typeof row[c] === 'string' && clean(row[c]) !== row[c]);
    if (!updates.length) continue;
    changed++;
    if (!dry) {
      await pool.query(
        `UPDATE ${table} SET ${updates.map((c) => `${c}=?`).join(', ')} WHERE id=?`,
        [...updates.map((c) => clean(row[c])), row.id],
      );
    }
  }
}

console.log(`${dry ? '[dry run] ' : ''}${changed} row(s) ${dry ? 'would be' : ''} updated.`);
process.exit(0);
