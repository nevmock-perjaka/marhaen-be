/*
  Warnings:

  - Added the required column `created_by` to the `Midtrans_User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Midtrans_User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `Midtrans_User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Midtrans_User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" TEXT NOT NULL;
