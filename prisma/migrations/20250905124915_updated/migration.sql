/*
  Warnings:

  - Added the required column `totalPrice` to the `cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cart` ADD COLUMN `totalPrice` INTEGER NOT NULL;
