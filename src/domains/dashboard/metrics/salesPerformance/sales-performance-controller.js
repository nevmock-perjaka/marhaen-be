import SalesPerformanceService from "./sales-performance-service.js";
import { successResponse } from "../../../../utils/response.js";

class SalesPerformanceController {
    async getPerformanceChart(req, res) {
        const { start_date, end_date } = req.query;
        const ownedBy = req.user?.id || req.user.owned_by || "";

        const data = await SalesPerformanceService.getSalesPerformanceInRange(
            start_date,
            end_date,
            ownedBy
        );

        return res.json(successResponse({ data }));
    }

    async comparePerformance(req, res) {
        const { mode } = req.query; // daily, weekly, monthly, yearly
        const ownedBy = req.user?.id || req.user.owned_by || "";

        const data = await SalesPerformanceService.compare(mode, ownedBy);

        return res.json(successResponse({ data }));
    }
}

export default new SalesPerformanceController();
