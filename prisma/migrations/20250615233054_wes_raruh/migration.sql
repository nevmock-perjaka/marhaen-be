/*
  Warnings:

  - You are about to drop the column `order_id` on the `Order_item_add_on` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Order_item_add_on` table. All the data in the column will be lost.
  - Added the required column `add_on_id` to the `Order_item_add_on` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_item_id` to the `Order_item_add_on` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order_item_add_on" DROP CONSTRAINT "Order_item_add_on_order_id_fkey";

-- DropForeignKey
ALTER TABLE "Order_item_add_on" DROP CONSTRAINT "Order_item_add_on_product_id_fkey";

-- AlterTable
ALTER TABLE "Order_item_add_on" DROP COLUMN "order_id",
DROP COLUMN "product_id",
ADD COLUMN     "add_on_id" TEXT NOT NULL,
ADD COLUMN     "order_item_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order_item_add_on" ADD CONSTRAINT "Order_item_add_on_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "Order_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item_add_on" ADD CONSTRAINT "Order_item_add_on_add_on_id_fkey" FOREIGN KEY ("add_on_id") REFERENCES "Add_on"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
