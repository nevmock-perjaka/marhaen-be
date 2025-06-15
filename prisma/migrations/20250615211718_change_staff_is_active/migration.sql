/*
  Warnings:

  - The `is_active` column on the `Staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `created_by` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `Staff_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `Staff_log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "updated_by" TEXT NOT NULL,
DROP COLUMN "is_active",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Staff_log" ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "updated_by" TEXT NOT NULL;
