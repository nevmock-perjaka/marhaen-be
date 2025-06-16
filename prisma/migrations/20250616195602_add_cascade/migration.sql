-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "Order_item" DROP CONSTRAINT "Order_item_order_id_fkey";

-- DropForeignKey
ALTER TABLE "Order_item" DROP CONSTRAINT "Order_item_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Order_item_add_on" DROP CONSTRAINT "Order_item_add_on_add_on_id_fkey";

-- DropForeignKey
ALTER TABLE "Order_item_add_on" DROP CONSTRAINT "Order_item_add_on_order_item_id_fkey";

-- DropForeignKey
ALTER TABLE "Order_transaction" DROP CONSTRAINT "Order_transaction_order_id_fkey";

-- DropForeignKey
ALTER TABLE "Staff_log" DROP CONSTRAINT "Staff_log_staff_id_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item" ADD CONSTRAINT "Order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item" ADD CONSTRAINT "Order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item_add_on" ADD CONSTRAINT "Order_item_add_on_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "Order_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item_add_on" ADD CONSTRAINT "Order_item_add_on_add_on_id_fkey" FOREIGN KEY ("add_on_id") REFERENCES "Add_on"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_transaction" ADD CONSTRAINT "Order_transaction_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff_log" ADD CONSTRAINT "Staff_log_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
