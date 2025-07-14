import dayjs from "dayjs";
import { successResponse } from "../../utils/response.js";
import AuthService from "../auth/auth-service.js";
import StaffLogService from "../shift/staff_log/staff-log-service.js";
import DashboardService from "./dashboard-service.js";

class DashboardController {
	async index(req, res) {
		const ownedBy = req.user.id;

		const now = new Date();

		let startDate = new Date(
			Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0),
		);
		let endDate = new Date(
			Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
		);

		startDate = new Date(startDate).toISOString();
		endDate = new Date(endDate).toISOString();

		const [
			netProfit,
			salesPerformance,
			ingredientCost,
			todayTransaction,
			staffLogs,
			strictMode,
		] = await Promise.all([
			DashboardService.netProfit._sum(startDate, endDate, ownedBy),
			DashboardService.salesPerformance._sum(startDate, endDate, ownedBy),
			DashboardService.ingredientCost._sum(ownedBy),
			DashboardService.transaction.todayTransactions(ownedBy),
			StaffLogService.todayStaffLogs(ownedBy),
			AuthService.getStrictMode(ownedBy),
		]);

		return successResponse(res, {
			range: { start: startDate, end: endDate },
			netProfit,
			salesPerformance,
			ingredientCost,
			todayTransaction,
			staffLogs,
			strictMode,
		});
	}
}

export default new DashboardController();
