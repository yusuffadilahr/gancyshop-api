/*
  Warnings:

  - You are about to drop the column `motorCycleName` on the `category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `category` DROP COLUMN `motorCycleName`,
    ADD COLUMN `categoryMotorcyleId` INTEGER NULL;

-- CreateTable
CREATE TABLE `CategoryMotorcyle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `motorCycleName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_categoryMotorcyleId_fkey` FOREIGN KEY (`categoryMotorcyleId`) REFERENCES `CategoryMotorcyle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
