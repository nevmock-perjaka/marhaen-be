-- DropForeignKey
ALTER TABLE "Add_on" DROP CONSTRAINT "Add_on_add_on_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Add_on_config" DROP CONSTRAINT "Add_on_config_add_on_id_fkey";

-- DropForeignKey
ALTER TABLE "Add_on_group" DROP CONSTRAINT "Add_on_group_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Product_config" DROP CONSTRAINT "Product_config_inventory_id_fkey";

-- DropForeignKey
ALTER TABLE "Product_config" DROP CONSTRAINT "Product_config_product_id_fkey";

-- AddForeignKey
ALTER TABLE "Product_config" ADD CONSTRAINT "Product_config_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_config" ADD CONSTRAINT "Product_config_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Add_on" ADD CONSTRAINT "Add_on_add_on_group_id_fkey" FOREIGN KEY ("add_on_group_id") REFERENCES "Add_on_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Add_on_group" ADD CONSTRAINT "Add_on_group_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Add_on_config" ADD CONSTRAINT "Add_on_config_add_on_id_fkey" FOREIGN KEY ("add_on_id") REFERENCES "Add_on"("id") ON DELETE CASCADE ON UPDATE CASCADE;
