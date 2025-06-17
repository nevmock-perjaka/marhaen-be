import DashboardService from "./dashboard-service.js";
import { successResponse } from "../../utils/response.js";
import dayjs from "dayjs";

class DashboardController {
    async index(req, res) {
        const ownedBy = req.user.id;
        const { start, end } = req.query;

        let startDate = start ? dayjs(start).startOf("day").toDate() : dayjs().startOf("month").toDate();
        let endDate = end ? dayjs(end).endOf("day").toDate() : dayjs().endOf("month").toDate();

        startDate = new Date(startDate).toISOString();
        endDate = new Date(endDate).toISOString();

        const [
            netProfit,
            salesPerformance,
            ingredientCost,
            topTransactions
        ] = await Promise.all([
            DashboardService.netProfit.getChartData(startDate, endDate, ownedBy),
            DashboardService.salesPerformance.getChartData(startDate, endDate, ownedBy),
            DashboardService.ingredientCost.getChartData(startDate, endDate, ownedBy),
            DashboardService.transaction.getChartData(startDate, endDate, ownedBy),
        ]);

        return successResponse(res, {
            range: { start: startDate, end: endDate },
            netProfit,
            salesPerformance,
            ingredientCost,
            topTransactions
        });
    }

    async show() {
        throw new Error("Not Implemented");
    }

    async create() {
        throw new Error("Not Implemented");
    }

    async update() {
        throw new Error("Not Implemented");
    }

    async delete() {
        throw new Error("Not Implemented");
    }
}

export default new DashboardController();
