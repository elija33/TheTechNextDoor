CREATE TABLE IF NOT EXISTS `app_settings` (
    `key` VARCHAR(255) NOT NULL,
    `value` LONGTEXT,
    PRIMARY KEY (`key`)
);
