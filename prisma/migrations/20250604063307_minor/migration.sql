/*
  Warnings:

  - Added the required column `imageId` to the `Branches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Branches" ADD COLUMN     "imageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "imageId" TEXT;
