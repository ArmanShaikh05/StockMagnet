/*
  Warnings:

  - Added the required column `profitGain` to the `InvoiceProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvoiceProduct" ADD COLUMN     "profitGain" DECIMAL(65,30) NOT NULL;
