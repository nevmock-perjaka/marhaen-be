import DashboardService from "./dashboard-service.js";
import { successResponse } from "../../utils/response.js";
import dayjs from "dayjs";

class DashboardController {
    async index(req, res) {
        const ownedBy = req.user.id;
        const { start, end } = req.query;

        const startDate = start ? dayjs(start).startOf("day").toDate() : dayjs().startOf("month").toDate();
        const endDate = end ? dayjs(end).endOf("day").toDate() : dayjs().endOf("month").toDate();

        const [
            netProfit,
            salesPerformance,
            ingredientCost,
            topTransactions
        ] = await Promise.all([
            DashboardService.netProfit.getChartData(ownedBy, startDate, endDate),
            DashboardService.salesPerformance.getChartData(ownedBy, startDate, endDate),
            DashboardService.ingredientCost.getChartData(ownedBy, startDate, endDate),
            DashboardService.transaction.getChartData(ownedBy, startDate, endDate),
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
