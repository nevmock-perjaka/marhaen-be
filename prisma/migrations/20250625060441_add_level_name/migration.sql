/*
  Warnings:

  - Added the required column `level_name` to the `Subscription_transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription_transaction" ADD COLUMN     "level_name" TEXT NOT NULL;
