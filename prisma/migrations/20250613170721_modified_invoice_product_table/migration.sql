/*
  Warnings:

  - Added the required column `Brand` to the `InvoiceProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Category` to the `InvoiceProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productImage` to the `InvoiceProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvoiceProduct" ADD COLUMN     "Brand" TEXT NOT NULL,
ADD COLUMN     "Category" TEXT NOT NULL,
ADD COLUMN     "productImage" TEXT NOT NULL;
