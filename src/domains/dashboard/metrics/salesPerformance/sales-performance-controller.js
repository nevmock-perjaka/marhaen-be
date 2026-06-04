import SalesPerformanceService from "./sales-performance-service.js";
import { successResponse } from "../../../../utils/response.js";

class SalesPerformanceController {
    async getByRange(req, res) {
        const { start_date, end_date } = req.query;
        const ownedBy = req.user?.id || req.user.owned_by || "";

        const data = await SalesPerformanceService.getChartData(
            start_date,
            end_date,
            ownedBy
        );

        return successResponse(res, data, "Sales performance berhasil diambil");
    }

    async getComparison(req, res) {
        const { mode } = req.query; // daily, weekly, monthly, yearly
        const ownedBy = req.user?.id || req.user.owned_by || "";

        const data = await SalesPerformanceService.compare(mode, ownedBy);

        return successResponse(res, data, "Perbandingan sales performance berhasil diambil");
    }
}

export default new SalesPerformanceController();
