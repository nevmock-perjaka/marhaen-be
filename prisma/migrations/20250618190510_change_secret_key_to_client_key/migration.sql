/*
  Warnings:

  - You are about to drop the column `secret_key` on the `Midtrans_User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Midtrans_User" DROP COLUMN "secret_key",
ADD COLUMN     "server_key" TEXT;
