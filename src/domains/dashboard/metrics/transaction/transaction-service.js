import prisma from "../../../../config/db.js";

class TransactionService {
    async getChartData(start, end, ownedBy) {
        const items = await prisma.order_item.findMany({
            where: {
                order: {
                    created_at: {
                        gte: start,
                        lte: end,
                    },
                    owned_by: ownedBy,
                    status: {
                        in: ["Paid"], // hanya order yang selesai/dibayar
                    },
                },
            },
            select: {
                product_id: true,
                quantity: true,
                price: true,
                product: {
                    select: {
                        name: true,
                        image_uri: true,
                        category: true,
                    },
                },
            },
        });

        // Grouping by product_id
        const grouped = {};
        for (const item of items) {
            const id = item.product_id;
            if (!grouped[id]) {
                grouped[id] = {
                    product_id: id,
                    name: item.product.name,
                    image_uri: item.product.image_uri,
                    category: item.product.category,
                    total_quantity: 0,
                    total_revenue: 0,
                };
            }
            grouped[id].total_quantity += item.quantity;
            grouped[id].total_revenue += item.price * item.quantity;
        }

        // Convert to array & sort by quantity desc
        const result = Object.values(grouped).sort(
            (a, b) => b.total_quantity - a.total_quantity
        );

        return result;
    }

    async todayTransactions(ownedBy) {
        const today = new Date();

        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        const paidOrderIds = await prisma.order.findMany({
            where: {
                owned_by: ownedBy,
                status: 'Paid',
                created_at: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            select: {
                id: true,
            },
        });

        const orderIds = paidOrderIds.map(order => order.id);

        if (orderIds.length === 0) return [];

        const topProducts = await prisma.order_item.groupBy({
            by: ['product_id'],
            where: {
                owned_by: ownedBy,
                order_id: {
                    in: orderIds,
                },
            },
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            }
        });

        const productIds = topProducts.map(p => p.product_id);

        const productDetails = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
        });

        const result = topProducts.map(item => {
            const product = productDetails.find(p => p.id === item.product_id);
            return {
                quantity: item._sum.quantity,
                product
            };
        });

        const totalTransactions = await prisma.order.count({
            where: {
                owned_by: ownedBy,
                status: 'Paid',
                created_at: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        const topVoucherAgg = await prisma.order.groupBy({
            by: ['discount_id'],
            where: {
                owned_by: ownedBy,
                status: 'Paid',
                discount_id: {
                    not: null 
                }
            },
            _count: {
                discount_id: true,
            },
            orderBy: {
                _count: {
                discount_id: 'desc',
                },
            },
            take: 1,
        });

        let topVoucher = [];
        if (topVoucherAgg.length > 0) {
            const discountIds = topVoucherAgg.map(v => v.discount_id);
            const discounts = await prisma.discount.findMany({
                where: { id: { in: discountIds } },
                select: { id: true, shareable_code: true, description: true },
            });
            topVoucher = topVoucherAgg.map(v => {
                const discount = discounts.find(d => d.id === v.discount_id);
                return {
                    discount_id: v.discount_id,
                    shareable_code: discount?.shareable_code ?? '-',
                    description: discount?.description ?? '',
                    total_usage: v._count.discount_id,
                };
            });
        }

        return { totalTransactions, topVoucher, topProduct: result };
    }
}

export default new TransactionService();
