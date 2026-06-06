import BaseError from "../../base_classes/base-error.js";
import { createdResponse, successResponse } from "../../utils/response.js";
import orderTransactionSchema from "./orderTransaction-schema.js";
import OrderTransactionService from "./orderTransaction-service.js";

class OrderTransactionController {
	async getAll(req, res) {
		const trxList = await OrderTransactionService.findAll();
		return successResponse(res, trxList);
	}

	async getById(req, res) {
		const { orderTransactionId } = req.params;
		const trx = await OrderTransactionService.findById(orderTransactionId);
		return successResponse(res, trx);
	}

	async create(req, res) {
		const { error, value } = orderTransactionSchema.create.validate(req.body);
		if (error) throw BaseError.badRequest(error.details[0].message);

		const created = await OrderTransactionService.create(value);
		return createdResponse(res, created);
	}

	async update(req, res) {
		const { orderTransactionId } = req.params;
		const { error, value } = orderTransactionSchema.update.validate(req.body);
		if (error) throw BaseError.badRequest(error.details[0].message);

		const updated = await OrderTransactionService.update(
			orderTransactionId,
			value,
		);
		return successResponse(res, updated);
	}

	async delete(req, res) {
		const { orderTransactionId } = req.params;
		const deleted = await OrderTransactionService.delete(orderTransactionId);
		return successResponse(res, deleted);
	}
}

export default new OrderTransactionController();
