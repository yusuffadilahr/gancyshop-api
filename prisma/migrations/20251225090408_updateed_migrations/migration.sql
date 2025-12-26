/*
  Warnings:

  - A unique constraint covering the columns `[resiNumber]` on the table `report` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `report_resiNumber_key` ON `report`(`resiNumber`);
