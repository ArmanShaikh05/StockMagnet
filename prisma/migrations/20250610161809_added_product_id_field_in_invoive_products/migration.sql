/*
  Warnings:

  - Added the required column `productId` to the `InvoiceProduct` table without a default value. This is not possible if the table is not empty.
  - Made the column `taxRate` on table `InvoiceProduct` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "InvoiceProduct" ADD COLUMN     "productId" TEXT NOT NULL,
ALTER COLUMN "taxRate" SET NOT NULL;
