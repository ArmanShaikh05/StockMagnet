-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('AVAILABLE', 'LOWSTOCK', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'AVAILABLE';
