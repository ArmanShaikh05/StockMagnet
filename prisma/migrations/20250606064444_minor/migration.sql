-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "totalProduct" SET DEFAULT 0,
ALTER COLUMN "totalRevenue" SET DEFAULT 0,
ALTER COLUMN "totalProfit" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "totalProfit" DECIMAL(65,30) DEFAULT 0,
ALTER COLUMN "totalProducts" SET DEFAULT 0;
