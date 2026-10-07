import 'dotenv/config';
import pool from './db.js';

try {
  try {
    await pool.query('ALTER TABLE categories ADD COLUMN parent_id INT DEFAULT NULL');
  } catch (error) {
    if (error.code !== 'ER_DUP_FIELDNAME') throw error;
  }
  try {
    await pool.query('ALTER TABLE categories ADD CONSTRAINT categories_parent_fk FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE');
  } catch (error) {
    if (!['ER_DUP_KEY', 'ER_CANT_CREATE_TABLE', 'ER_FK_DUP_NAME'].includes(error.code)) throw error;
  }
  try {
    await pool.query('ALTER TABLE portfolio_items ADD COLUMN source_path VARCHAR(1000) DEFAULT NULL');
  } catch (error) {
    if (error.code !== 'ER_DUP_FIELDNAME') throw error;
  }
  try {
    await pool.query('ALTER TABLE portfolio_items ADD UNIQUE KEY portfolio_source_path_unique (source_path)');
  } catch (error) {
    if (!['ER_DUP_KEYNAME', 'ER_DUP_ENTRY'].includes(error.code)) throw error;
  }
  console.log('Image library migration complete.');
} catch (error) {
  console.error('Image library migration failed:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}