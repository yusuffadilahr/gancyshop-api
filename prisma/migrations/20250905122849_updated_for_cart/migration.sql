/*
  Warnings:

  - You are about to drop the `cartitem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_userId_fkey`;

-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_ownerId_fkey`;

-- DropIndex
DROP INDEX `Cart_userId_key` ON `cart`;

-- AlterTable
ALTER TABLE `cart` ADD COLUMN `price` INTEGER NOT NULL,
    ADD COLUMN `productId` INTEGER NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- DropTable
DROP TABLE `cartitem`;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
