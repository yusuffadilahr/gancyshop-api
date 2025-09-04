/*
  Warnings:

  - You are about to drop the column `categoryMotorcyleId` on the `category` table. All the data in the column will be lost.
  - You are about to drop the `categorymotorcyle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_categoryMotorcyleId_fkey`;

-- DropIndex
DROP INDEX `Category_categoryMotorcyleId_fkey` ON `category`;

-- AlterTable
ALTER TABLE `cart` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `categoryMotorcyleId`,
    ADD COLUMN `categoryMotorcycleId` INTEGER NULL,
    MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `chatsession` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `messagecustomer` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `updatedAt` DATETIME(3) NULL;

-- DropTable
DROP TABLE `categorymotorcyle`;

-- CreateTable
CREATE TABLE `categorymotorcycle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `motorCycleName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,
    `releaseYear` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Category_categoryMotorcycleId_fkey` ON `category`(`categoryMotorcycleId`);

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `Category_categoryMotorcycleId_fkey` FOREIGN KEY (`categoryMotorcycleId`) REFERENCES `categorymotorcycle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
