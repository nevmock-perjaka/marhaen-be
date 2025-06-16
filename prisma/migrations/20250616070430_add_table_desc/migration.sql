/*
  Warnings:

  - Added the required column `table_desc` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "table_desc" TEXT NOT NULL;
