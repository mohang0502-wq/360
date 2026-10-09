import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import pool from './db.js';

const imageRoot = path.resolve('public/images');
const generatedRoot = path.resolve('public/generated-images');
const supported = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff', '.gif']);
const importedSourcePaths = new Set();
const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
// Keep '&' literal: some static servers (incl. Vite) don't decode %26 in file paths.
const encodeSegment = (segment) => encodeURIComponent(segment).replace(/%26/g, '&');
const publicUrl = (relativePath) => `/images/${relativePath.split(path.sep).map(encodeSegment).join('/')}`;
const browserUrl = async (relativePath) => {
  const extension = path.extname(relativePath).toLowerCase();
  if (!['.tif', '.tiff'].includes(extension)) return publicUrl(relativePath);
  const generatedPath = relativePath.replace(/\.(tif|tiff)$/i, '.jpg');
  try {
    await fs.access(path.join(generatedRoot, generatedPath));
    return `/generated-images/${generatedPath.split(path.sep).map(encodeSegment).join('/')}`;
  } catch {
    return publicUrl(relativePath);
  }
};

async function ensureBrowserAsset(relativePath) {
  if (!['.tif', '.tiff'].includes(path.extname(relativePath).toLowerCase())) return;
  const output = path.join(generatedRoot, relativePath.replace(/\.(tif|tiff)$/i, '.jpg'));
  await fs.mkdir(path.dirname(output), { recursive: true });
  try {
    await fs.access(output);
  } catch {
    try {
      await sharp(path.join(imageRoot, relativePath), { limitInputPixels: false, sequentialRead: true })
        .rotate()
        .jpeg({ quality: 88 })
        .toFile(output);
    } catch (error) {
      console.warn(`Could not convert ${relativePath}; keeping original URL.`, error.message);
    }
  }
}

async function directories(relative = '') {
  const entries = await fs.readdir(path.join(imageRoot, relative), { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).sort((a, b) => naturalSort(a.name, b.name));
}

async function files(relative) {
  const entries = await fs.readdir(path.join(imageRoot, relative), { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && supported.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort(naturalSort);
}

async function ensureCategory(name, slug, parentId, sortOrder) {
  const [existing] = await pool.query('SELECT id FROM categories WHERE group_type=? AND slug=?', ['portfolio', slug]);
  if (existing[0]) {
    await pool.query('UPDATE categories SET name=?, parent_id=?, sort_order=? WHERE id=?', [name, parentId, sortOrder, existing[0].id]);
    return existing[0].id;
  }
  const [result] = await pool.query(
    'INSERT INTO categories (group_type, name, slug, parent_id, sort_order) VALUES (?,?,?,?,?)',
    ['portfolio', name, slug, parentId, sortOrder]
  );
  return result.insertId;
}

async function importFolder(parentRelative, parentId = null) {
  const childFolders = await directories(parentRelative);
  const rootName = parentRelative ? path.basename(parentRelative) : '';
  const currentId = parentRelative
    ? await ensureCategory(rootName, slugify(parentRelative.replaceAll(path.sep, '-')), parentId, 0)
    : null;

  if (parentRelative) {
    const imageNames = await files(parentRelative);
    const explicitBefore = imageNames.find((name) => /(^|[ _-])before([ _.\-]|$)/i.test(name));
    const explicitAfter = imageNames.find((name) => /(^|[ _-])after([ _.\-]|$)/i.test(name));
    const pairs = explicitBefore && explicitAfter
      ? [[explicitBefore, explicitAfter], ...imageNames.filter((name) => name !== explicitBefore && name !== explicitAfter).reduce((result, name, index, remaining) => index % 2 === 0 ? [...result, [name, remaining[index + 1] || name]] : result, [])]
      : imageNames.reduce((result, name, index) => index % 2 === 0 && imageNames[index + 1] ? [...result, [name, imageNames[index + 1]]] : result, []);

    for (const [index, [beforeName, afterName]] of pairs.entries()) {
      if (beforeName === afterName) continue;
      const beforeRelative = path.join(parentRelative, beforeName);
      const afterRelative = path.join(parentRelative, afterName);
      await ensureBrowserAsset(beforeRelative);
      await ensureBrowserAsset(afterRelative);
      const beforeUrl = await browserUrl(beforeRelative);
      const afterUrl = await browserUrl(afterRelative);
      const sourcePath = beforeRelative.split(path.sep).join('/') + '|' + afterRelative.split(path.sep).join('/');
      importedSourcePaths.add(sourcePath);
      const caption = path.parse(beforeName).name.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
      await pool.query(
        `INSERT INTO portfolio_items (type, category_id, caption, before_image, after_image, source_path, sort_order)
         VALUES (?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE category_id=VALUES(category_id), caption=VALUES(caption), before_image=VALUES(before_image), after_image=VALUES(after_image), sort_order=VALUES(sort_order)`,
        ['manual', currentId, caption || rootName, beforeUrl, afterUrl, sourcePath, index]
      );
    }
  }

  for (const [index, folder] of childFolders.entries()) {
    await importFolder(path.join(parentRelative, folder.name), currentId);
    if (currentId) await pool.query('UPDATE categories SET sort_order=? WHERE id=?', [index + 1, currentId]);
  }
}

try {
  await importFolder('');
  const [existingItems] = await pool.query('SELECT id, source_path FROM portfolio_items WHERE source_path IS NOT NULL');
  for (const item of existingItems) {
    if (!importedSourcePaths.has(item.source_path)) {
      await pool.query('DELETE FROM portfolio_items WHERE id=?', [item.id]);
    }
  }
  const [[{ categories }]] = await pool.query("SELECT COUNT(*) AS categories FROM categories WHERE group_type='portfolio'");
  const [[{ items }]] = await pool.query('SELECT COUNT(*) AS items FROM portfolio_items WHERE source_path IS NOT NULL');
  console.log(`Image library import complete: ${categories} portfolio categories, ${items} imported portfolio items.`);
} catch (error) {
  console.error('Image library import failed:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}