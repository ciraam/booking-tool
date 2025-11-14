-- CreateTable
CREATE TABLE `Event` (
    `event_id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_name` VARCHAR(191) NOT NULL,
    `event_description` VARCHAR(191) NOT NULL,
    `event_price` INTEGER NOT NULL,
    `event_picture` VARCHAR(191) NOT NULL,
    `event_location` VARCHAR(191) NOT NULL,
    `event_date` DATETIME(3) NOT NULL,
    `event_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `booking_id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_event_id` INTEGER NOT NULL,
    `booking_user_id` INTEGER NOT NULL,
    `booking_price` INTEGER NOT NULL,
    `booking_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_firstname` VARCHAR(191) NOT NULL,
    `user_lastname` VARCHAR(191) NOT NULL,
    `user_pseudo` VARCHAR(191) NOT NULL,
    `user_email` VARCHAR(191) NOT NULL,
    `user_picture` VARCHAR(191) NOT NULL,
    `user_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_firstname` VARCHAR(191) NOT NULL,
    `admin_lastname` VARCHAR(191) NOT NULL,
    `admin_pseudo` VARCHAR(191) NOT NULL,
    `admin_email` VARCHAR(191) NOT NULL,
    `admin_picture` VARCHAR(191) NOT NULL,
    `admin_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organization` (
    `organization_id` INTEGER NOT NULL AUTO_INCREMENT,
    `organization_user_id` INTEGER NOT NULL,
    `organization_name` VARCHAR(191) NOT NULL,
    `organization_description` VARCHAR(191) NOT NULL,
    `organization_picture` VARCHAR(191) NOT NULL,
    `organization_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`organization_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
