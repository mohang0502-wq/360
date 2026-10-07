import 'dotenv/config';
import pool from './db.js';

const columns = [
  ['facebook', 'VARCHAR(500) DEFAULT NULL'],
  ['instagram', 'VARCHAR(500) DEFAULT NULL'],
  ['linkedin', 'VARCHAR(500) DEFAULT NULL'],
  ['youtube', 'VARCHAR(500) DEFAULT NULL'],
  ['logo_url', 'VARCHAR(500) DEFAULT NULL'],
  ['favicon_url', 'VARCHAR(500) DEFAULT NULL'],
];

try {
  for (const [name, definition] of columns) {
    try {
      await pool.query(`ALTER TABLE site_settings ADD COLUMN ${name} ${definition}`);
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') throw error;
    }
  }
  await pool.query("UPDATE site_settings SET logo_url = '/images/360.png' WHERE logo_url IS NULL OR logo_url = ''");
  console.log('Site settings migration complete.');
} catch (error) {
  console.error('Site settings migration failed:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}