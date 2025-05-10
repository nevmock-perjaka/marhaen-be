import { successResponse } from "../../../utils/response.js";
import planService from "../../plan/plan-service.js";
import subscriptionService from "./subscription-service.js";

class SubscriptionController {
    async create(req, res) {
        const { plan_id } = req.body;
        const { user } = req
        
        const snap = await subscriptionService.createSnap(plan_id, user);

        return successResponse(res, snap); 
    }
}

export default new SubscriptionController();