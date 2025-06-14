-- AlterTable
ALTER TABLE "Branches" ADD COLUMN     "grossRevenue" DECIMAL(65,30) DEFAULT 0.0,
ADD COLUMN     "netRevenue" DECIMAL(65,30) DEFAULT 0.0;
