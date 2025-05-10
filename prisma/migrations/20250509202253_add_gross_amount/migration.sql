/*
  Warnings:

  - You are about to drop the column `amount` on the `SubscriptionTransaction` table. All the data in the column will be lost.
  - Added the required column `gross_amount` to the `SubscriptionTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubscriptionTransaction" DROP COLUMN "amount",
ADD COLUMN     "gross_amount" DOUBLE PRECISION NOT NULL;
