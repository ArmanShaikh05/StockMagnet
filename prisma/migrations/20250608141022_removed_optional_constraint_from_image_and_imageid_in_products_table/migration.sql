/*
  Warnings:

  - Made the column `productImage` on table `Products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageId` on table `Products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "productImage" SET NOT NULL,
ALTER COLUMN "imageId" SET NOT NULL;
