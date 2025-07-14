import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import Joi from "joi";
import BaseError from "../../../base_classes/base-error.js";
import { createdResponse, successResponse } from "../../../utils/response.js";
import inventoryService from "../inventory-service.js";
import supplierService from "../supplier/supplier-service.js";
import inputHistorySchema from "./inputHistory-schema.js";
import InputHistoryService from "./inputHistory-service.js";

class InputHistoryController {
	async getAll(req, res) {
		const userId = req.user.id;
		const histories = await InputHistoryService.findAll(userId);
		return successResponse(res, histories);
	}

	async getById(req, res) {
		const { id } = req.params;
		const userId = req.user.id;
		const history = await InputHistoryService.findById(id, userId);
		return successResponse(res, history);
	}

	async create(req, res) {
		const value = req.body;

		try {
			await supplierService.findById(value.supplier_id, req.user.id);
		} catch (error) {
			let validation = "";
			const stack = [];

			validation += "Supplier not found.";

			stack.push({
				message: "Supplier not found.",
				path: ["supplier_id"],
			});

			throw new Joi.ValidationError(validation, stack);
		}

		try {
			await inventoryService.findById(value.inventory_id, req.user.id);
		} catch (error) {
			let validation = "";
			const stack = [];

			validation += "Inventory not found.";

			stack.push({
				message: "Inventory not found.",
				path: ["inventory_id"],
			});

			throw new Joi.ValidationError(validation, stack);
		}

		value.owned_by = req.user.id;
		value.created_by = req.profile.id;
		value.updated_by = req.profile.id;
		value.current_stock = value.total_stock;

		const created = await InputHistoryService.create(value);
		return createdResponse(res, created);
	}

	async update(req, res) {
		const { id } = req.params;
		const value = req.body;

		value.updated_by = req.profile.id;
		value.owned_by = req.user.id;

		const updated = await InputHistoryService.update(id, value);
		return successResponse(res, updated);
	}

	async delete(req, res) {
		const { id } = req.params;
		const userId = req.user.id;

		const deleted = await InputHistoryService.delete(id, userId);
		return successResponse(res, deleted);
	}
}

export default new InputHistoryController();
