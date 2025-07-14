import { successResponse } from "../../utils/response.js";
import PerformanceService from "./performance-service.js"; // Ganti x

class PerformanceController {
	async getAll(req, res) {
		const result = await PerformanceService.getAll();
		return successResponse(res, result);
	}
}

export default new PerformanceController();
