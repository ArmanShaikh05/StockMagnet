/*
  Warnings:

  - Added the required column `BrandColorCode` to the `InvoiceProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CategoryColorCode` to the `InvoiceProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvoiceProduct" ADD COLUMN     "BrandColorCode" TEXT NOT NULL,
ADD COLUMN     "CategoryColorCode" TEXT NOT NULL;
