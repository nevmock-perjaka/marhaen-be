import db from "../../../../config/db.js";

import { format, addDays, addMonths, differenceInDays, startOfDay, startOfWeek, startOfMonth, startOfYear, subMonths, subYears, endOfDay, endOfWeek, endOfMonth, endOfYear, formatISO } from "date-fns";

class IngredientCostService {
    async getChartData(startDate, endDate, ownedBy) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const isDaily = differenceInDays(end, start) < 31;

        const ingredientCosts = await db.input_history.findMany({
            where: {
                owned_by: ownedBy,
                created_at: {
                    gte: start,
                    lte: end,
                },
            },
            select: {
                price: true,
                created_at: true,
            }
        })
        
        const groupedData = {};

        ingredientCosts.forEach(cost => {
            const key = format(cost.created_at, isDaily ? "yyyy-MM-dd" : "yyyy-MM");
            if (!groupedData[key]) {
                groupedData[key] = 0;
            }
            groupedData[key] += cost.price;
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
        const result = await db.input_history.aggregate({
            _sum: { price: true },
            where: {
                owned_by: ownedBy,
                created_at: {
                    gte: startDate,
                    lte: endDate,
                }
            },
        });

        return result._sum.price || 0;
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

    async _sum(ownedBy) {
        const ingredientCost = await db.input_history.aggregate({
            _sum: {
                price: true,
            },
            where: {
                owned_by: ownedBy
            },
        });

        return ingredientCost._sum.price || 0;
    }
}

export default new IngredientCostService();