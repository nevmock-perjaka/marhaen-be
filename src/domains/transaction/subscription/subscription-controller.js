import { successResponse } from "../../../utils/response.js";

import subscriptionService from "./subscription-service.js";

class SubscriptionController {
	async create(req, res) {
		const { plan_id } = req.body;
		const { user } = req;

		const snap = await subscriptionService.createSnap(plan_id, user);

		return successResponse(res, snap);
	}

	async getAll(req, res) {
		const { user } = req;
		const subscriptions = await subscriptionService.findAll(user.id);

		return successResponse(res, subscriptions);
	}
}

export default new SubscriptionController();
