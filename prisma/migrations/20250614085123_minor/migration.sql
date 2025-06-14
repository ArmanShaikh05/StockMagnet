/*
  Warnings:

  - You are about to alter the column `grossRevenue` on the `Branches` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `netRevenue` on the `Branches` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Branches" ALTER COLUMN "grossRevenue" SET DEFAULT 0,
ALTER COLUMN "grossRevenue" SET DATA TYPE INTEGER,
ALTER COLUMN "netRevenue" SET DEFAULT 0,
ALTER COLUMN "netRevenue" SET DATA TYPE INTEGER;
