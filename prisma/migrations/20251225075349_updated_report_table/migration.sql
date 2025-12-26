/*
  Warnings:

  - You are about to drop the column `productId` on the `report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `report_productId_fkey`;

-- DropIndex
DROP INDEX `Report_productId_fkey` ON `report`;

-- DropIndex
DROP INDEX `report_resiNumber_key` ON `report`;

-- AlterTable
ALTER TABLE `report` DROP COLUMN `productId`;

-- CreateTable
CREATE TABLE `reportitems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reportId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `subtotal` INTEGER NOT NULL,
    `discount` INTEGER NOT NULL,
    `adminFee` INTEGER NOT NULL,
    `net` INTEGER NOT NULL,

    UNIQUE INDEX `reportitems_reportId_productId_key`(`reportId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reportitems` ADD CONSTRAINT `reportitems_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `report`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reportitems` ADD CONSTRAINT `reportitems_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
