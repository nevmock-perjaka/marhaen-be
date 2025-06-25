import SalesPerformanceService from "./sales-performance-service.js";
import { successResponse } from "../../../../utils/response.js";

class SalesPerformanceController {
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
            endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)); // Hari ini
        }

        startDate = startDate.toISOString();
        endDate = endDate.toISOString();

        const data = await SalesPerformanceService.getChartData(
            startDate, 
            endDate,
            ownedBy
        );

        return successResponse(res, data);
    }

    async getComparison(req, res) {
        const { mode } = req.query; // daily, weekly, monthly, yearly
        const ownedBy = req.user?.id || req.user.owned_by || "";

        const data = await SalesPerformanceService.compare(mode, ownedBy);

        return res.json(successResponse({ data }));
    }
}

export default new SalesPerformanceController();
