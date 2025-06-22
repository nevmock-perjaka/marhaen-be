/*
  Warnings:

  - You are about to drop the `Ppn` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Ppn";

-- CreateTable
CREATE TABLE "Site_config" (
    "id" TEXT NOT NULL,
    "ppn_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_config_pkey" PRIMARY KEY ("id")
);
