/*
  Warnings:

  - A unique constraint covering the columns `[stripPaymentId]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payments_stripPaymentId_key" ON "Payments"("stripPaymentId");
