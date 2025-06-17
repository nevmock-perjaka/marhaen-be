import dayjs from "dayjs";
import prisma from "../../../../config/db.js";

class NetProfitService {
    async getChartData(startDate, endDate, ownedBy) {
        const orders = await prisma.order.findMany({
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
                owned_by: ownedBy,
                status: { in: ["Paid"] },
            },
            include: {
                Order_transaction: true,
                discount: true,
            },
        });

        if (!orders || orders.length === 0) {
            return {
                totalGross: 0,
                totalAdminFee: 0,
                netProfit: 0,
                startDate,
                endDate,
            };
        }

        const totalGross = orders.reduce((sum, order) => sum + order.total_gross, 0);
        const totalAdminFee = orders.reduce((sum, order) => sum + (order.Order_transaction?.admin_fee || 0), 0);

        return {
            totalGross,
            totalAdminFee,
            netProfit: totalGross - totalAdminFee,
            startDate,
            endDate,
        };
    }

    async compare(mode, ownedBy) {
        const today = dayjs();

        let currentStart, currentEnd, prevStart, prevEnd;

        switch (mode) {
            case "daily":
                currentStart = today.startOf("day");
                currentEnd = today.endOf("day");
                prevStart = currentStart.subtract(1, "month");
                prevEnd = currentEnd.subtract(1, "month");
                break;

            case "weekly":
                currentStart = today.startOf("week");
                currentEnd = today.endOf("week");
                prevStart = currentStart.subtract(1, "month");
                prevEnd = currentEnd.subtract(1, "month");
                break;

            case "monthly":
                currentStart = today.startOf("month");
                currentEnd = today.endOf("month");
                prevStart = currentStart.subtract(1, "month");
                prevEnd = currentEnd.subtract(1, "month");
                break;

            case "yearly":
                currentStart = today.startOf("year");
                currentEnd = today.endOf("year");
                prevStart = currentStart.subtract(1, "year");
                prevEnd = currentEnd.subtract(1, "year");
                break;

            default:
                throw new Error("Invalid comparison mode");
        }

        const current = await this.getNetProfitInRange(currentStart.toDate(), currentEnd.toDate(), ownedBy);
        const previous = await this.getNetProfitInRange(prevStart.toDate(), prevEnd.toDate(), ownedBy);

        return {
            current,
            previous,
            mode,
        };
    }
}

export default new NetProfitService();