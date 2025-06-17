import dayjs from "dayjs";
import prisma from "../../../../config/db.js";

class IngredientCostService {
    async getChartData(startDate, endDate, ownedBy) {
        const start = dayjs(startDate).startOf("day").toDate();
        const end = dayjs(endDate).endOf("day").toDate();

        const orders = await prisma.order.findMany({
            where: {
                created_at: { 
                    gte: start, 
                    lte: end 
                },
                owned_by: ownedBy,
            },
            include: {
                Order_item: {
                    include: {
                        product: {
                            include: {
                                Product_config: {
                                    include: {
                                        inventory: true,
                                    },
                                },
                            },
                        },
                        Order_item_add_on: {
                            include: {
                                add_on: {
                                    include: {
                                        Add_on_config: {
                                            include: {
                                                inventory: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const inventoryMap = new Map();

        for (const order of orders) {
            for (const item of order.Order_item) {
                const quantity = item.quantity;

                for (const config of item.product.Product_config) {
                    const key = config.inventory.id;
                    const valueUsed = config.value * quantity;

                    if (!inventoryMap.has(key)) {
                        inventoryMap.set(key, {
                            inventory: config.inventory,
                            totalUsed: valueUsed,
                        });
                    } else {
                        inventoryMap.get(key).totalUsed += valueUsed;
                    }
                }

                for (const addOnItem of item.Order_item_add_on) {
                    for (const config of addOnItem.add_on.Add_on_config) {
                        const key = config.inventory.id;
                        const valueUsed = config.value * quantity;

                        if (!inventoryMap.has(key)) {
                            inventoryMap.set(key, {
                                inventory: config.inventory,
                                totalUsed: valueUsed,
                            });
                        } else {
                            inventoryMap.get(key).totalUsed += valueUsed;
                        }
                    }
                }
            }
        }

        let totalCost = 0;

        for (const [inventoryId, { totalUsed }] of inventoryMap) {
            const latestInput = await prisma.input_history.findFirst({
                where: {
                    inventory_id: inventoryId,
                    owned_by: ownedBy,
                },
                orderBy: {
                    input_datetime: "desc",
                },
            });

            const pricePerUnit = latestInput?.price || 0;
            totalCost += totalUsed * pricePerUnit;
        }

        return {
            total_cost: totalCost,
            details: Array.from(inventoryMap.values()).map((item) => ({
                name: item.inventory.product_name,
                used: item.totalUsed,
            })),
        };
    }

    async compare(mode, ownedBy) {
        const today = dayjs();
        let currentRange, previousRange;

        switch (mode) {
            case "daily":
                currentRange = {
                    start: today.startOf("day"),
                    end: today.endOf("day"),
                };
                previousRange = {
                    start: today.subtract(1, "month").startOf("day"),
                    end: today.subtract(1, "month").endOf("day"),
                };
                break;
            case "weekly":
                currentRange = {
                    start: today.startOf("week"),
                    end: today.endOf("week"),
                };
                previousRange = {
                    start: today.subtract(1, "month").startOf("week"),
                    end: today.subtract(1, "month").endOf("week"),
                };
                break;
            case "monthly":
                currentRange = {
                    start: today.startOf("month"),
                    end: today.endOf("month"),
                };
                previousRange = {
                    start: today.subtract(1, "month").startOf("month"),
                    end: today.subtract(1, "month").endOf("month"),
                };
                break;
            case "yearly":
                currentRange = {
                    start: today.startOf("year"),
                    end: today.endOf("year"),
                };
                previousRange = {
                    start: today.subtract(1, "year").startOf("year"),
                    end: today.subtract(1, "year").endOf("year"),
                };
                break;
            default:
                throw new Error("Invalid mode");
        }

        const current = await this.getIngredientCostInRange(
            currentRange.start,
            currentRange.end,
            ownedBy
        );

        const previous = await this.getIngredientCostInRange(
            previousRange.start,
            previousRange.end,
            ownedBy
        );

        return {
            current: current.total_cost,
            previous: previous.total_cost,
        };
    }
}

export default new IngredientCostService();