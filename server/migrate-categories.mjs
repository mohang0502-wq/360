import 'dotenv/config';
import pool from './db.js';

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function ensureCategory(groupType, name, sortOrder) {
  const slug = slugify(name);
  await pool.query(
    `INSERT INTO categories (group_type, name, slug, sort_order) VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE name=VALUES(name), sort_order=VALUES(sort_order)`,
    [groupType, name, slug, sortOrder]
  );
  const [rows] = await pool.query('SELECT id FROM categories WHERE group_type=? AND slug=?', [groupType, slug]);
  return rows[0].id;
}

async function migrate() {
  const portfolioNames = ['Fashion', 'Product', 'Furniture', 'Jewelry', 'AI Generated'];
  const portfolioIds = new Map();
  for (const [index, name] of portfolioNames.entries()) portfolioIds.set(name, await ensureCategory('portfolio', name, index + 1));

  const [portfolioRows] = await pool.query('SELECT id, type, caption FROM portfolio_items ORDER BY id');
  for (const row of portfolioRows) {
    const category = row.type === 'ai'
      ? portfolioIds.get('AI Generated')
      : portfolioIds.get(/jewelry/i.test(row.caption) ? 'Jewelry' : /furniture|home/i.test(row.caption) ? 'Furniture' : /product/i.test(row.caption) ? 'Product' : 'Fashion');
    await pool.query('UPDATE portfolio_items SET category_id=? WHERE id=?', [category, row.id]);
  }

  const [serviceRows] = await pool.query('SELECT id, title FROM services ORDER BY id');
  for (const [index, row] of serviceRows.entries()) {
    const categoryId = await ensureCategory('service', row.title, index + 1);
    await pool.query('UPDATE services SET category_id=? WHERE id=?', [categoryId, row.id]);
  }

  await pool.query("DELETE FROM categories WHERE (group_type='portfolio' AND slug IN ('manual','ai')) OR (group_type='service' AND slug IN ('manual','ai'))");

  console.log('Category migration complete.');
  await pool.end();
}

migrate().catch(async (error) => {
  console.error('Category migration failed:', error);
  await pool.end();
  process.exit(1);
});