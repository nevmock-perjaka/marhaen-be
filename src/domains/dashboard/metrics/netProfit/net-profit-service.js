import dayjs from "dayjs";
import prisma from "../../../../config/db.js";
import ingredientCostService from "../ingredientCost/ingredient-cost-service.js";
import salesPerformanceService from "../salesPerformance/sales-performance-service.js";

class NetProfitService {
	async getChartData(startDate, endDate, ownedBy) {
		const salesPerformance = await salesPerformanceService.getChartData(
			startDate,
			endDate,
			ownedBy,
		);
		const ingredientCost = await ingredientCostService.getChartData(
			startDate,
			endDate,
			ownedBy,
		);

		const fullRangeData = [];
		for (let i = 0; i < salesPerformance.length; i++) {
			const salesDate = dayjs(salesPerformance[i].date);
			const ingredientDate = dayjs(ingredientCost[i].date);

			if (salesDate.isSame(ingredientDate, "day")) {
				fullRangeData.push({
					date: salesPerformance[i].date,
					sales: salesPerformance[i].value,
					ingredientCost: ingredientCost[i].value,
					value: salesPerformance[i].value - ingredientCost[i].value,
				});
			} else {
				fullRangeData.push({
					date: salesPerformance[i].date,
					sales: salesPerformance[i].value,
					ingredientCost: 0,
					value: salesPerformance[i].value,
				});
			}
		}

		return fullRangeData;
	}

	async compare(ownedBy) {
		const salesPerformance = await salesPerformanceService.compare(ownedBy);
		const ingredientCost = await ingredientCostService.compare(ownedBy);

		const periods = ["today", "thisWeek", "thisMonth", "thisYear"];

		const netProfit = {};

		for (const period of periods) {
			const sales = salesPerformance[period];
			const cost = ingredientCost[period];

			const current = sales.current - cost.current;
			const previous = sales.previous - cost.previous;
			const diff = current - previous;

			const percentage =
				previous === 0 ? (current === 0 ? 0 : 100) : (diff / previous) * 100;

			netProfit[period] = {
				current,
				previous,
				diff,
				percentage: Math.round(percentage),
				isIncrease: diff >= 0,
				current_range: sales.current_range,
				previous_range: sales.previous_range,
			};
		}

		return netProfit;
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

		const ingredientCost = await prisma.input_history.aggregate({
			_sum: {
				price: true,
			},
			where: {
				input_datetime: {
					gte: startDate,
					lte: endDate,
				},
				owned_by: ownedBy,
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

		const prevIngredientCost = await prisma.input_history.aggregate({
			_sum: {
				price: true,
			},
			where: {
				input_datetime: {
					gte: prevStartDate,
					lte: prevEndDate,
				},
				owned_by: ownedBy,
			},
		});

		const currentTotal =
			salesPerformance._sum.total_gross - ingredientCost._sum.price;
		const previousTotal =
			prevSalesPerformance._sum.total_gross - prevIngredientCost._sum.price;

		let percentageChange = 0;

		percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;

		// if (previousTotal === 0 && currentTotal > 0) {
		//     percentageChange = 100;
		// } else if (previousTotal === 0 && currentTotal === 0) {
		//     percentageChange = 0;
		// } else {
		//     percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;
		// }

		return {
			total: currentTotal,
			difference: currentTotal - previousTotal,
			percentage: percentageChange,
		};
	}
}

export default new NetProfitService();
