/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `totalResult` on the `report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `report` DROP COLUMN `totalPrice`,
    DROP COLUMN `totalResult`;
