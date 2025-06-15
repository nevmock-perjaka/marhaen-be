/*
  Warnings:

  - You are about to drop the column `Status` on the `Supplier` table. All the data in the column will be lost.
  - Added the required column `status` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "Status",
ADD COLUMN     "status" BOOLEAN NOT NULL;
