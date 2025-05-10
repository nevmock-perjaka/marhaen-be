/*
  Warnings:

  - You are about to drop the column `createdAt` on the `SubscriptionTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SubscriptionTransaction` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `SubscriptionTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubscriptionTransaction" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "order_id" DROP NOT NULL,
ALTER COLUMN "transaction_token" DROP NOT NULL,
ALTER COLUMN "redirect_url" DROP NOT NULL,
ALTER COLUMN "admin_fee" DROP NOT NULL,
ALTER COLUMN "payment_method" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "gross_amount" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "days" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);
