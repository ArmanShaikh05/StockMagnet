/*
  Warnings:

  - A unique constraint covering the columns `[brandName,userClerkId]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryName,userClerkId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[unitName,userClerkId]` on the table `Units` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userClerkId` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userClerkId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "userClerkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "userClerkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Units" ADD COLUMN     "userClerkId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Brand_brandName_userClerkId_key" ON "Brand"("brandName", "userClerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryName_userClerkId_key" ON "Category"("categoryName", "userClerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Units_unitName_userClerkId_key" ON "Units"("unitName", "userClerkId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userClerkId_fkey" FOREIGN KEY ("userClerkId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_userClerkId_fkey" FOREIGN KEY ("userClerkId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Units" ADD CONSTRAINT "Units_userClerkId_fkey" FOREIGN KEY ("userClerkId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;
