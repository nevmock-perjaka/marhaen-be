import prisma from "../../../../config/db.js";

class TransactionService {
    async getSoldProducts(start, end, ownedBy) {
        const items = await prisma.order_item.findMany({
            where: {
                order: {
                    created_at: {
                        gte: new Date(start),
                        lte: new Date(end),
                    },
                    owned_by: ownedBy,
                    status: {
                        in: ["PAID", "COMPLETED"], // hanya order yang selesai/dibayar
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
}

export default new TransactionService();
