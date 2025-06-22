-- AlterTable
ALTER TABLE "Order_transaction" ADD COLUMN     "ppn_fee" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Subscription_transaction" ADD COLUMN     "ppn_fee" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Ppn" (
    "id" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ppn_pkey" PRIMARY KEY ("id")
);
