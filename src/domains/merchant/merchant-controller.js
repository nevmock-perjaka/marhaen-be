import { successResponse } from "../../utils/response.js";
import MerchantService from "./merchant-service.js"; // Ganti Merchant

class MerchantController {
    async getAll(req, res) {
        const result = await MerchantService.getAll();
        return successResponse(res, result);
    }
}

export default new MerchantController();
