/*
  Warnings:

  - You are about to drop the `_ProductsToPurchaseOrders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductsToPurchaseOrders" DROP CONSTRAINT "_ProductsToPurchaseOrders_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductsToPurchaseOrders" DROP CONSTRAINT "_ProductsToPurchaseOrders_B_fkey";

-- DropTable
DROP TABLE "_ProductsToPurchaseOrders";

-- CreateTable
CREATE TABLE "PurchaseOrderProduct" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "PurchaseOrderProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PurchaseOrderProduct" ADD CONSTRAINT "PurchaseOrderProduct_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderProduct" ADD CONSTRAINT "PurchaseOrderProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
