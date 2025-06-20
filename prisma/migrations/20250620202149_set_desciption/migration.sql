/*
  Warnings:

  - You are about to drop the column `name` on the `Discount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "name",
ADD COLUMN     "description" TEXT;
