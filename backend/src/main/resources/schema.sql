-- Ensure tables with MySQL reserved word column names are created on startup.
-- globally_quoted_identifiers=true handles DDL going forward, but these tables
-- failed to be created in earlier deployments due to unquoted reserved words.

CREATE TABLE IF NOT EXISTS `app_settings` (
    `key` VARCHAR(255) NOT NULL,
    `value` LONGTEXT,
    PRIMARY KEY (`key`)
);

CREATE TABLE IF NOT EXISTS `repair_orders` (
    `id` VARCHAR(255) NOT NULL,
    `customer` VARCHAR(255),
    `email` VARCHAR(255),
    `phone` VARCHAR(255),
    `brand` VARCHAR(255),
    `grouping` VARCHAR(255),
    `model` VARCHAR(255),
    `service` VARCHAR(255),
    `date` VARCHAR(255),
    `time` VARCHAR(255),
    `notes` VARCHAR(2000),
    `amount` VARCHAR(255),
    `status` VARCHAR(255),
    `timestamp` BIGINT,
    `text_confirmation` BIT(1),
    `images` LONGTEXT,
    `street_address` VARCHAR(255),
    `city` VARCHAR(255),
    `zip_postal_code` VARCHAR(255),
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `contact_messages` (
    `id` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255),
    `last_name` VARCHAR(255),
    `email` VARCHAR(255),
    `phone` VARCHAR(255),
    `contact_method` VARCHAR(255),
    `message` VARCHAR(5000),
    `images` LONGTEXT,
    `timestamp` BIGINT,
    `unread` BIT(1),
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `quote_images` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255),
    `data` LONGTEXT,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `quote_requests` (
    `id` VARCHAR(255) NOT NULL,
    `brand` VARCHAR(255),
    `grouping` VARCHAR(255),
    `model` VARCHAR(255),
    `service` VARCHAR(255),
    `first_name` VARCHAR(255),
    `last_name` VARCHAR(255),
    `email` VARCHAR(255),
    `phone` VARCHAR(255),
    `timestamp` BIGINT,
    `status` VARCHAR(255),
    PRIMARY KEY (`id`)
);
