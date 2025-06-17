-- AlterTable
ALTER TABLE "Midtrans_User" ADD COLUMN     "is_production" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "unit_type" TEXT;
