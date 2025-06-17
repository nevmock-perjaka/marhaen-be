import { successResponse } from "../../utils/response.js";
import midtransService from "./midtrans-service.js";
import ProfileService from "./midtrans-service.js";

class MidtransController {
    async get(req, res) {
        const { user } = req;
        const midtransConfig = await midtransService.getMidtransConfig(user.id);

        return successResponse(res, midtransConfig);
    }

    async update(req, res) {
        const { user } = req;
        const { profile } = req;
        const value = req.body;
        
        value.updated_by = profile.id;
        value.owned_by = user.id;

        const updatedConfig = await midtransService.updateMidtransConfig(user.id, value);

        return successResponse(res, updatedConfig);
        
    }
}

export default new MidtransController();