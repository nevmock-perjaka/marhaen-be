import {
	addDays,
	addMonths,
	differenceInDays,
	endOfDay,
	endOfMonth,
	endOfWeek,
	endOfYear,
	format,
	formatISO,
	startOfDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
	subMonths,
	subYears,
} from "date-fns";
import db from "../../../../config/db.js";

class SalesPerformanceService {
    async getChartData(startDate, endDate, ownedBy) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const orders = await prisma.order.findMany({
            where: {
                owned_by: ownedBy,
                created_at: {
                    gte: start,
                    lte: end,
                },
                status: "Paid", // status order yang sudah dibayar
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
                status: "Paid",
            },
            _sum: {
                total_gross: true,
            },
        });

        return total._sum.total_gross || 0;
    }

    async _sum(startDate, endDate, ownedBy) {
        const now = new Date();

        const prevMonth = now.getMonth() - 1;
        const year = prevMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
        const month = (prevMonth + 12) % 12;

        let prevStartDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));
        let prevEndDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

        prevStartDate = prevStartDate.toISOString();
        prevEndDate = prevEndDate.toISOString();

        const salesPerformance = await prisma.order.aggregate({
            _sum: {
                total_gross: true,
            },
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
                owned_by: ownedBy,
                status: "Paid",
            },
        });

        const prevSalesPerformance = await prisma.order.aggregate({
            _sum: {
                total_gross: true,
            },
            where: {
                created_at: {
                    gte: prevStartDate,
                    lte: prevEndDate,
                },
                owned_by: ownedBy,
                status: "Paid",
            },
        });

        const currentTotal = salesPerformance._sum.total_gross ?? 0;
        const previousTotal = prevSalesPerformance._sum.total_gross ?? 0;

        let percentageChange = 0;
        if (previousTotal > 0) {
            percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
        }

        return {
            total: currentTotal,
            difference: currentTotal - previousTotal,
            percentage: Math.round(percentageChange)
        };
    }
}

export default new SalesPerformanceService();
