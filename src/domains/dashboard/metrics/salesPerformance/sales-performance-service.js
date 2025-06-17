import prisma from "../../../../config/db.js";
import dayjs from "dayjs";

class SalesPerformanceService {
    async getChartData(startDate, endDate, ownedBy) {
        const orders = await prisma.order.findMany({
            where: {
                owned_by: ownedBy,
                created_at: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
                status: "PAID", // status order yang sudah dibayar
            },
            select: {
                total_gross: true,
                created_at: true,
            },
        });

        const grouped = {};

        for (const order of orders) {
            const key = dayjs(order.created_at).format("YYYY-MM-DD");
            if (!grouped[key]) grouped[key] = 0;
            grouped[key] += order.total_gross;
        }

        return Object.entries(grouped).map(([date, total]) => ({
            date,
            total_gross: total,
        }));
    }

    async compare(mode, ownedBy) {
        const now = dayjs();

        let currentStart, currentEnd, lastStart, lastEnd;

        switch (mode) {
            case "daily":
                currentStart = now.startOf("day");
                currentEnd = now.endOf("day");
                lastStart = currentStart.subtract(1, "month");
                lastEnd = currentEnd.subtract(1, "month");
                break;
            case "weekly":
                currentStart = now.startOf("week");
                currentEnd = now.endOf("week");
                lastStart = currentStart.subtract(1, "month");
                lastEnd = currentEnd.subtract(1, "month");
                break;
            case "monthly":
                currentStart = now.startOf("month");
                currentEnd = now.endOf("month");
                lastStart = currentStart.subtract(1, "month");
                lastEnd = currentEnd.subtract(1, "month");
                break;
            case "yearly":
                currentStart = now.startOf("year");
                currentEnd = now.endOf("year");
                lastStart = currentStart.subtract(1, "year");
                lastEnd = currentEnd.subtract(1, "year");
                break;
            default:
                throw new Error("Mode tidak valid");
        }

        const [currentTotal, lastTotal] = await Promise.all([
            this._sumSales(currentStart.toDate(), currentEnd.toDate(), ownedBy),
            this._sumSales(lastStart.toDate(), lastEnd.toDate(), ownedBy),
        ]);

        return {
            current: currentTotal,
            previous: lastTotal,
            difference: currentTotal - lastTotal,
            percentage: lastTotal > 0
                ? ((currentTotal - lastTotal) / lastTotal) * 100
                : 100,
        };
    }

    async _sumSales(startDate, endDate, ownedBy) {
        const total = await prisma.order.aggregate({
            where: {
                owned_by: ownedBy,
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
                status: "PAID",
            },
            _sum: {
                total_gross: true,
            },
        });

        return total._sum.total_gross || 0;
    }
}

export default new SalesPerformanceService();