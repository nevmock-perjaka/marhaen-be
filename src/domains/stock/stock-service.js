import db from "../../config/db.js";
import BaseError from "../../base_classes/base-error.js";

class StockService {
    async reduceStockByOrder(orderId) {
        // Cek apakah sudah pernah diproses
        const existingLog = await db.stock_log.findUnique({ where: { order_id: orderId } });
        if (existingLog) throw BaseError.badRequest("Stok dari order ini sudah dikurangi sebelumnya.");

        const order = await db.order.findUnique({
            where: { id: orderId },
            include: {
                Order_item: {
                    include: {
                        product: {
                            include: { Product_config: true }
                        }
                    }
                },
                Order_item_add_on: {
                    include: {
                        product: {
                            include: {
                                Add_on_config: true
                            }
                        }
                    }
                }
            }
        });

        if (!order) throw BaseError.notFound("Order tidak ditemukan.");

        // Kurangi stok berdasarkan product
        for (const item of order.Order_item) {
            for (const config of item.product.Product_config) {
                const qty = config.value * item.quantity;
                await this._adjustStock(config.inventory_id, -qty);
            }
        }

        // Kurangi stok berdasarkan add-on
        for (const addon of order.Order_item_add_on) {
            for (const config of addon.product.Add_on_config) {
                await this._adjustStock(config.inventory_id, -config.value);
            }
        }

        // Catat ke stock_log
        await db.stock_log.create({
            data: {
                order_id: orderId,
                action: "REDUCE",
                note: "Auto reduce stock from order"
            }
        });
    }

    async addStockFromInput(inputHistoryId) {
        // Cek apakah sudah ditambahkan
        const existingLog = await db.stock_log.findUnique({ where: { input_id: inputHistoryId } });
        if (existingLog) throw BaseError.badRequest("Stok dari input ini sudah ditambahkan sebelumnya.");

        const input = await db.input_history.findUnique({
            where: { id: inputHistoryId }
        });

        if (!input) throw BaseError.notFound("Input history tidak ditemukan.");

        const { inventory_id, current_stock, total_stock } = input;

        let newStock = 0;

        if (current_stock === 0 || current_stock === null) {
            newStock = total_stock;
        } else {
            newStock = current_stock + total_stock;
        }

        await db.input_history.update({
            where: { id: inputHistoryId },
            data: { current_stock: newStock }
        });

        await db.stock_log.create({
            data: {
                input_id: inputHistoryId,
                action: "ADD",
                note: "Stock added from supplier input"
            }
        });
    }

    async _adjustStock(inventoryId, delta) {
        const latest = await db.input_history.findFirst({
            where: { inventory_id: inventoryId },
            orderBy: { input_datetime: "desc" }
        });

        if (!latest) throw BaseError.notFound("Input history untuk inventory tidak ditemukan.");

        const newStock = (latest.current_stock || 0) + delta;
        if (newStock < 0) throw BaseError.badRequest("Stok tidak mencukupi!");

        await db.input_history.update({
            where: { id: latest.id },
            data: { current_stock: newStock }
        });
    }

    async getStockByInventory(inventoryId) {
        const latest = await db.input_history.findFirst({
            where: { inventory_id: inventoryId },
            orderBy: { input_datetime: "desc" }
        });

        return {
            inventoryId,
            current_stock: latest?.current_stock || 0
        };
    }
}

export default new StockService();