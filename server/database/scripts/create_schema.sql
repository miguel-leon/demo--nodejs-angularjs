CREATE SCHEMA 'demodb';

-- GENERATED BY SEQUELIZE AFTER RUNNING migration.js
--CREATE TABLE IF NOT EXISTS `profile` (`id` INTEGER NOT NULL auto_increment , `name` VARCHAR(45) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
--CREATE TABLE IF NOT EXISTS `holding` (`id` INTEGER NOT NULL auto_increment , `name` VARCHAR(45) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
--CREATE TABLE IF NOT EXISTS `user` (`id` INTEGER NOT NULL auto_increment , `profile_id` INTEGER NOT NULL, `holding_id` INTEGER NOT NULL, `email` VARCHAR(45) NOT NULL UNIQUE, `password` VARCHAR(255) NOT NULL, `name` VARCHAR(45) NOT NULL, `last_name` VARCHAR(45) NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`profile_id`) REFERENCES `profile` (`id`), FOREIGN KEY (`holding_id`) REFERENCES `holding` (`id`)) ENGINE=InnoDB;
