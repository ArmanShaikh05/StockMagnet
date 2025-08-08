/*
  Warnings:

  - You are about to drop the column `userId` on the `Suppliers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userClerkId]` on the table `Suppliers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userClerkId` to the `Suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Suppliers" DROP CONSTRAINT "Suppliers_userId_fkey";

-- DropIndex
DROP INDEX "Suppliers_userId_key";

-- AlterTable
ALTER TABLE "Suppliers" DROP COLUMN "userId",
ADD COLUMN     "userClerkId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_userClerkId_key" ON "Suppliers"("userClerkId");

-- AddForeignKey
ALTER TABLE "Suppliers" ADD CONSTRAINT "Suppliers_userClerkId_fkey" FOREIGN KEY ("userClerkId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;
