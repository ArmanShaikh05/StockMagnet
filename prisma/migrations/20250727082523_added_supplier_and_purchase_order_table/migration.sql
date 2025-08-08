-- CreateTable
CREATE TABLE "Suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "gstNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrders" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "invoiceImageUrl" TEXT,
    "invoiceImageId" TEXT,
    "totalItems" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "creditedAmount" INTEGER,
    "paymentStatus" "InvoiceStatus" NOT NULL,
    "paymentMode" "PaymentMode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductsToPurchaseOrders" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductsToPurchaseOrders_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_email_key" ON "Suppliers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_userId_key" ON "Suppliers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrders_branchId_key" ON "PurchaseOrders"("branchId");

-- CreateIndex
CREATE INDEX "_ProductsToPurchaseOrders_B_index" ON "_ProductsToPurchaseOrders"("B");

-- AddForeignKey
ALTER TABLE "Suppliers" ADD CONSTRAINT "Suppliers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrders" ADD CONSTRAINT "PurchaseOrders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrders" ADD CONSTRAINT "PurchaseOrders_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductsToPurchaseOrders" ADD CONSTRAINT "_ProductsToPurchaseOrders_A_fkey" FOREIGN KEY ("A") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductsToPurchaseOrders" ADD CONSTRAINT "_ProductsToPurchaseOrders_B_fkey" FOREIGN KEY ("B") REFERENCES "PurchaseOrders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
