-- CreateTable
CREATE TABLE "Stock_log" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "order_id" TEXT,
    "input_id" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stock_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_log_order_id_key" ON "Stock_log"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_log_input_id_key" ON "Stock_log"("input_id");

-- AddForeignKey
ALTER TABLE "Stock_log" ADD CONSTRAINT "Stock_log_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock_log" ADD CONSTRAINT "Stock_log_input_id_fkey" FOREIGN KEY ("input_id") REFERENCES "Input_history"("id") ON DELETE SET NULL ON UPDATE CASCADE;
