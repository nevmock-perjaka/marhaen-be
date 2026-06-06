import { successResponse } from "../../utils/response.js";
import HomeService from "./home-service.js";

class HomeController {
	async getAll(req, res) {
		const result = await HomeService.getAll();
		return successResponse(res, result);
	}
}

export default new HomeController();
