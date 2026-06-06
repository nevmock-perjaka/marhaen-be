-- AlterTable
ALTER TABLE "Order" ADD COLUMN "payment_method" TEXT NOT NULL DEFAULT 'Manual QRIS',
ADD COLUMN "canceled_at" TIMESTAMP(3),
ADD COLUMN "cancellation_reason" TEXT;
