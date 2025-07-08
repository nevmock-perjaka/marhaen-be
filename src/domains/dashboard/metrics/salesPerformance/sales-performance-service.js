import db from "../../../../config/db.js";
import { format, addDays, addMonths, differenceInDays, startOfDay, startOfWeek, startOfMonth, startOfYear, subMonths, subYears, endOfDay, endOfWeek, endOfMonth, endOfYear, formatISO } from "date-fns";

class SalesPerformanceService {
    async getChartData(startDate, endDate, ownedBy) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const isDaily = differenceInDays(end, start) < 31;

        const orders = await db.order.findMany({
            where: {
                owned_by: ownedBy,
                created_at: {
                    gte: start,
                    lte: end,
                },
                status: "Paid",
            },
            select: {
                total_gross: true,
                created_at: true,
            },
        });

        const groupedData = {};

        orders.forEach(order => {
            const key = format(order.created_at, isDaily ? "yyyy-MM-dd" : "yyyy-MM");
            if (!groupedData[key]) {
                groupedData[key] = 0;
            }
            groupedData[key] += order.total_gross;
        });

        const fullRangeData = [];
        let current = new Date(start);

        while (current <= end) {
            const key = format(current, isDaily ? "yyyy-MM-dd" : "yyyy-MM");
            fullRangeData.push({
                date: key,
                value: groupedData[key] || 0,
            });
            current = isDaily ? addDays(current, 1) : addMonths(current, 1);
        }

        return fullRangeData;
    }


    async getTotal(ownedBy, startDate, endDate) {
        const result = await db.order.aggregate({
            _sum: { total_gross: true },
            where: {
                owned_by: ownedBy,
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
                status: "Paid",
            },
        });

        return result._sum.total_gross || 0;
    }

    calcChange(current, previous, currentRange, previousRange) {
        const diff = current - previous;
        const percentage = previous === 0 ? 0 : (diff / previous) * 100;
        const isIncrease = diff >= 0;

        return {
            current,
            previous,
            diff,
            percentage: Math.round(percentage * 10) / 10, // 1 decimal place
            isIncrease,
            current_range: {
                start_date: currentRange.start_date,
                end_date: currentRange.end_date,
            },
            previous_range: {
                start_date: previousRange.start_date,
                end_date: previousRange.end_date,
            }
        };
    }

    async compare(ownedBy) {
        const now = new Date();

        // Today vs same day last month
        const todayStart = startOfDay(now);
        const todayEnd = endOfDay(now);
        const prevDay = subMonths(todayStart, 1);
        const prevDayEnd = endOfDay(prevDay);

        // This Week vs same week last month
        const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const weekEnd = endOfDay(now);
        const tempWeekEnd = endOfWeek(now, { weekStartsOn: 1 });

        const prevWeekStart = subMonths(weekStart, 1);
        const prevWeekEnd = subMonths(tempWeekEnd, 1);

        // This Month vs last month
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        const prevMonthStart = subMonths(monthStart, 1);
        const prevMonthEnd = endOfMonth(prevMonthStart);

        // This Year vs last year
        const yearStart = startOfYear(now);
        const yearEnd = endOfYear(now);
        const prevYearStart = subYears(yearStart, 1);
        const prevYearEnd = endOfYear(prevYearStart);

        // Get total for each period
        const [
            todayTotal,
            prevDayTotal,
            weekTotal,
            prevWeekTotal,
            monthTotal,
            prevMonthTotal,
            yearTotal,
            prevYearTotal
        ] = await Promise.all([
            this.getTotal(ownedBy, todayStart, todayEnd),
            this.getTotal(ownedBy, prevDay, prevDayEnd),
            this.getTotal(ownedBy, weekStart, weekEnd),
            this.getTotal(ownedBy, prevWeekStart, prevWeekEnd),
            this.getTotal(ownedBy, monthStart, monthEnd),
            this.getTotal(ownedBy, prevMonthStart, prevMonthEnd),
            this.getTotal(ownedBy, yearStart, yearEnd),
            this.getTotal(ownedBy, prevYearStart, prevYearEnd)
        ]);
        const todayRange = {
            start_date: formatISO(todayStart),
            end_date: formatISO(todayEnd)
        };
        const prevDayRange = {
            start_date: formatISO(prevDay),
            end_date: formatISO(prevDayEnd) 
        };

        const weekRange = {
            start_date: formatISO(weekStart),
            end_date: formatISO(weekEnd)
        };

        const prevWeekRange = {
            start_date: formatISO(prevWeekStart),
            end_date: formatISO(prevWeekEnd)
        };

        const monthRange = {
            start_date: formatISO(monthStart),
            end_date: formatISO(monthEnd)
        };

        const prevMonthRange = {
            start_date: formatISO(prevMonthStart),
            end_date: formatISO(prevMonthEnd)
        };
        
        const yearRange = {
            start_date: formatISO(yearStart),
            end_date: formatISO(yearEnd)
        };

        const prevYearRange = {
            start_date: formatISO(prevYearStart),
            end_date: formatISO(prevYearEnd)
        };

        return {
            today: this.calcChange(todayTotal, prevDayTotal, todayRange, prevDayRange),
            thisWeek: this.calcChange(weekTotal, prevWeekTotal, weekRange, prevWeekRange),
            thisMonth: this.calcChange(monthTotal, prevMonthTotal, monthRange, prevMonthRange),
            thisYear: this.calcChange(yearTotal, prevYearTotal, yearRange, prevYearRange),
        };
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

        const salesPerformance = await db.order.aggregate({
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

        const prevSalesPerformance = await db.order.aggregate({
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

        let percentageChange = 0;

        percentageChange = ((salesPerformance - prevSalesPerformance) / prevSalesPerformance) * 100;

        return {
            total: salesPerformance._sum.total_gross,
            difference: salesPerformance._sum.total_gross - prevSalesPerformance._sum.total_gross,
            percentage: percentageChange
        };
    }
}

export default new SalesPerformanceService();