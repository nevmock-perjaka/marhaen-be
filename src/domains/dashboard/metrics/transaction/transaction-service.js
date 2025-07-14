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

class TransactionService {
	async getChartData(startDate, endDate, ownedBy) {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const isDaily = differenceInDays(end, start) < 31;

		const transactions = await db.order.findMany({
			where: {
				owned_by: ownedBy,
				created_at: {
					gte: start,
					lte: end,
				},
				status: "Paid",
			},
			select: {
				created_at: true,
			},
		});

		const groupedData = {};

		transactions.forEach((order) => {
			const key = format(order.created_at, isDaily ? "yyyy-MM-dd" : "yyyy-MM");
			if (!groupedData[key]) {
				groupedData[key] = 0;
			}
			groupedData[key] += 1; // 🔁 Hitung jumlah order
		});

		const fullRangeData = [];
		let current = new Date(start);

		while (current <= end) {
			const key = format(current, isDaily ? "yyyy-MM-dd" : "yyyy-MM");
			fullRangeData.push({
				date: key,
				count: groupedData[key] || 0,
			});
			current = isDaily ? addDays(current, 1) : addMonths(current, 1);
		}

		return fullRangeData;
	}

	async topMenu(startDate, endDate, ownedBy) {
		const start = new Date(startDate);
		const end = new Date(endDate);

		const paidOrderIds = await db.order.findMany({
			where: {
				owned_by: ownedBy,
				status: "Paid",
				created_at: {
					gte: start,
					lte: end,
				},
			},
			select: {
				id: true,
			},
		});

		const orderIds = paidOrderIds.map((order) => order.id);

		if (orderIds.length === 0) return [];

		const topProducts = await db.order_item.groupBy({
			by: ["product_id"],
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
					quantity: "desc",
				},
			},
		});

		const productIds = topProducts.map((p) => p.product_id);

		const productDetails = await db.product.findMany({
			where: {
				id: {
					in: productIds,
				},
			},
		});

		const result = topProducts.map((item) => {
			const product = productDetails.find((p) => p.id === item.product_id);
			return {
				quantity: item._sum.quantity,
				product,
			};
		});

		return result;
	}

	async todayTransactions(ownedBy) {
		const today = new Date();

		const startOfDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
			0,
			0,
			0,
		);
		const endOfDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
			23,
			59,
			59,
		);

		const paidOrderIds = await db.order.findMany({
			where: {
				owned_by: ownedBy,
				status: "Paid",
				created_at: {
					gte: startOfDay,
					lte: endOfDay,
				},
			},
			select: {
				id: true,
			},
		});

		const orderIds = paidOrderIds.map((order) => order.id);

		if (orderIds.length === 0) return [];

		const topProducts = await db.order_item.groupBy({
			by: ["product_id"],
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
					quantity: "desc",
				},
			},
		});

		const productIds = topProducts.map((p) => p.product_id);

		const productDetails = await db.product.findMany({
			where: {
				id: {
					in: productIds,
				},
			},
		});

		const result = topProducts.map((item) => {
			const product = productDetails.find((p) => p.id === item.product_id);
			return {
				quantity: item._sum.quantity,
				product,
			};
		});

		const totalTransactions = await db.order.count({
			where: {
				owned_by: ownedBy,
				status: "Paid",
				created_at: {
					gte: startOfDay,
					lte: endOfDay,
				},
			},
		});

		const topVoucher = await db.order.groupBy({
			by: ["discount_id"],
			where: {
				owned_by: ownedBy,
				status: "Paid",
				discount_id: {
					not: null,
				},
			},
			_count: {
				discount_id: true,
			},
			orderBy: {
				_count: {
					discount_id: "desc",
				},
			},
			take: 1,
		});

		return { totalTransactions, topVoucher, topProduct: result };
	}
}

export default new TransactionService();
