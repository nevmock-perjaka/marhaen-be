/*
  Warnings:

  - Added the required column `staff_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "staff_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order_transaction" ADD COLUMN     "redirect_url" TEXT,
ADD COLUMN     "transaction_token" TEXT,
ALTER COLUMN "transaction_id" DROP NOT NULL,
ALTER COLUMN "gross_amount" DROP NOT NULL,
ALTER COLUMN "payment_method" DROP NOT NULL,
ALTER COLUMN "admin_fee" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
