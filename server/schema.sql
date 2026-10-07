CREATE DATABASE IF NOT EXISTS `360_retouching`;
USE `360_retouching`;

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `site_name` VARCHAR(255) NOT NULL,
  `tagline` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `whatsapp` VARCHAR(50) DEFAULT NULL,
  `address` VARCHAR(500) DEFAULT NULL,
  `facebook` VARCHAR(500) DEFAULT NULL,
  `instagram` VARCHAR(500) DEFAULT NULL,
  `linkedin` VARCHAR(500) DEFAULT NULL,
  `youtube` VARCHAR(500) DEFAULT NULL,
  `logo_url` VARCHAR(500) DEFAULT NULL,
  `favicon_url` VARCHAR(500) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Generic content blocks: every editable section of every page
-- (home.hero, home.trust, services.manual, about.story, contact.faqs,
--  pricing.plans, howItWorks.steps, ...) lives here as one JSON blob
-- per (page_key, section_key). This is what makes every section on
-- every page dynamic without a new table per page.
CREATE TABLE IF NOT EXISTS `page_sections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_key` VARCHAR(100) NOT NULL,
  `section_key` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `content_json` JSON NOT NULL,
  `sort_order` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `page_section_unique` (`page_key`, `section_key`)
);

-- Dynamic categories, shared by portfolio and services so admin can
-- add/rename/remove categories without touching code.
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_type` ENUM('portfolio','service') NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `parent_id` INT DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `category_slug_unique` (`group_type`, `slug`)
  ,FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('manual','ai') NOT NULL,
  `category_id` INT DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `items_json` JSON DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `portfolio_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('manual','ai') NOT NULL,
  `category_id` INT DEFAULT NULL,
  `caption` VARCHAR(255) NOT NULL,
  `before_image` VARCHAR(500) NOT NULL,
  `after_image` VARCHAR(500) NOT NULL,
  `source_path` VARCHAR(700) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `portfolio_source_path_unique` (`source_path`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
);

-- Central media library so uploaded files can be listed / replaced /
-- deleted from the admin panel, and cleaned up on disk on delete.
CREATE TABLE IF NOT EXISTS `media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) DEFAULT NULL,
  `url` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `contact_submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `service` VARCHAR(150) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('new','read','replied','archived') NOT NULL DEFAULT 'new',
  `admin_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin'
);

INSERT INTO `site_settings` (`site_name`, `tagline`, `phone`, `email`, `whatsapp`, `address`, `facebook`, `instagram`, `linkedin`, `youtube`, `logo_url`, `favicon_url`)
VALUES ('360° Retouching', 'Quality · Precision · Perfection', '+91 98765 43210', 'info@360retouching.com', '+91 98765 43210', '', '', '', '', '', '/images/360.png', '')
ON DUPLICATE KEY UPDATE `site_name` = VALUES(`site_name`);

-- default admin login: username "admin" / password "admin123"
-- CHANGE THIS PASSWORD after first login.
INSERT INTO `admin_users` (`username`, `password_hash`, `role`)
VALUES ('admin@360.com', '$2a$10$cVN9NfnCFGDAPtJes0NU4ex.bOlfNF/ugUmL5o1GG9syYmuM1kzQO', 'admin')
ON DUPLICATE KEY UPDATE `password_hash` = VALUES(`password_hash`), `role` = VALUES(`role`);

INSERT INTO `categories` (`group_type`, `name`, `slug`, `sort_order`) VALUES
('portfolio', 'Fashion', 'fashion', 1),
('portfolio', 'Product', 'product', 2),
('portfolio', 'Furniture', 'furniture', 3),
('portfolio', 'Jewelry', 'jewelry', 4),
('portfolio', 'AI Generated', 'ai-generated', 5)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `sort_order` = VALUES(`sort_order`);
