import { successResponse } from "../../../../utils/response.js";
import TransactionService from "./transaction-service.js";

class TransactionController {
	async getByRange(req, res) {
		const { start_date, end_date } = req.query;
		const ownedBy = req.user.id;

		let startDate, endDate;

		if (start_date && end_date) {
			startDate = new Date(start_date);
			endDate = new Date(end_date);
		} else {
			const now = new Date();
			startDate = new Date(Date.UTC(now.getFullYear(), 0, 1, 0, 0, 0)); // Awal tahun
			endDate = new Date(
				Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
			); // Hari ini
		}

		startDate = startDate.toISOString();
		endDate = endDate.toISOString();

		const [chartData, topMenu] = await Promise.all([
			TransactionService.getChartData(startDate, endDate, ownedBy),
			TransactionService.topMenu(startDate, endDate, ownedBy),
		]);

		return successResponse(res, { chartData, topMenu });
	}
}

export default new TransactionController();
