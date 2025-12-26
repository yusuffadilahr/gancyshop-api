/*
  Warnings:

  - You are about to drop the column `discount` on the `reportitems` table. All the data in the column will be lost.
  - You are about to drop the column `net` on the `reportitems` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `reportitems` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `reportitems` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reportitems` DROP COLUMN `discount`,
    DROP COLUMN `net`,
    DROP COLUMN `price`,
    DROP COLUMN `subtotal`;
