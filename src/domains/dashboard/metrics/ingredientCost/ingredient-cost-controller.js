import IngredientCostService from "./ingredient-cost-service.js";
import { successResponse, errorResponse } from "../../../../utils/response.js";

class IngredientCostController {
    async getByRange(req, res) {
        try {
            const { start, end } = req.query;
            const ownedBy = req.user?.id || req.user?.owned_by;

            if (!start || !end) {
                return errorResponse(res, 400, "start dan end date harus diisi");
            }

            const result = await IngredientCostService.getIngredientCostInRange(start, end, ownedBy);
            return successResponse(res, result, "Biaya bahan berhasil diambil");
        } catch (error) {
            console.error("[IngredientCostController:getByRange]", error);
            return errorResponse(res, 500, error.message || "Gagal mengambil biaya bahan");
        }
    }

    async getComparison(req, res) {
        try {
            const { mode } = req.query;
            const ownedBy = req.user?.id || req.user?.owned_by;

            if (!["daily", "weekly", "monthly", "yearly"].includes(mode)) {
                return errorResponse(res, 400, "Mode harus salah satu dari: daily, weekly, monthly, yearly");
            }

            const result = await IngredientCostService.compare(mode, ownedBy);
            return successResponse(res, result, `Perbandingan biaya bahan (${mode}) berhasil`);
        } catch (error) {
            console.error("[IngredientCostController:getComparison]", error);
            return errorResponse(res, 500, error.message || "Gagal mengambil data perbandingan biaya bahan");
        }
    }
}

export default new IngredientCostController();