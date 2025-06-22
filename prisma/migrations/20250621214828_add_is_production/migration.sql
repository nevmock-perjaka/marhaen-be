/*
  Warnings:

  - Added the required column `is_production` to the `Order_transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order_transaction" ADD COLUMN     "is_production" BOOLEAN NOT NULL;
