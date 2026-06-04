-- CreateIndex
CREATE INDEX "Discount_owned_by_idx" ON "Discount"("owned_by");

-- CreateIndex
CREATE INDEX "Discount_shareable_code_idx" ON "Discount"("shareable_code");

-- CreateIndex
CREATE INDEX "Order_owned_by_idx" ON "Order"("owned_by");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_staff_id_idx" ON "Order"("staff_id");

-- CreateIndex
CREATE INDEX "Order_item_order_id_idx" ON "Order_item"("order_id");

-- CreateIndex
CREATE INDEX "Order_item_product_id_idx" ON "Order_item"("product_id");

-- CreateIndex
CREATE INDEX "Product_owned_by_idx" ON "Product"("owned_by");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_is_active_idx" ON "Product"("is_active");

-- CreateIndex
CREATE INDEX "Staff_owned_by_idx" ON "Staff"("owned_by");

-- CreateIndex
CREATE INDEX "Staff_log_owned_by_end_timestamp_idx" ON "Staff_log"("owned_by", "end_timestamp");

-- CreateIndex
CREATE INDEX "Table_owned_by_idx" ON "Table"("owned_by");

-- CreateIndex
CREATE INDEX "Table_is_active_idx" ON "Table"("is_active");
