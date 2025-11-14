/*
  Warnings:

  - Added the required column `event_category` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_category` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `event_category` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `organization` ADD COLUMN `organization_category` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Ticket` (
    `ticket_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_event_id` INTEGER NOT NULL,
    `ticket_name` VARCHAR(191) NOT NULL,
    `ticket_description` VARCHAR(191) NOT NULL,
    `ticket_price` INTEGER NOT NULL,
    `ticket_available` INTEGER NOT NULL,
    `ticket_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ticket_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
