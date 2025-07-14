import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const productConfigSchema = {
	// Schema untuk create Product_config
	create: Joi.object({
		product_id: Joi.string().required(),
		inventory_id: Joi.string().required(),
		operation: Joi.string().valid("add", "reduce").required(),
		value: Joi.number().integer().min(1).required(),
	}),

	// Schema untuk update Product_config
	update: Joi.object({
		operation: Joi.string().valid("add", "reduce").optional(),
		value: Joi.number().integer().min(1).optional(),
	}),

	// Schema untuk params get Product_config
	params: Joi.object({
		get_all: Joi.boolean().optional().default(true),

		pagination: Joi.object({
			page: Joi.number().integer().min(1).default(1),
			limit: Joi.number().integer().min(1).max(100).default(10),
		}).when("get_all", {
			is: false,
			then: Joi.required(),
			otherwise: Joi.forbidden(),
		}),

		order_by: Joi.array()
			.items(
				Joi.object({
					field: Joi.string()
						.valid("operation", "value", "created_at", "updated_at")
						.required(),
					direction: Joi.string().valid("asc", "desc").default("asc"),
				}),
			)
			.optional(),

		include_relation: Joi.array()
			.items(Joi.string().valid("product", "inventory"))
			.optional(),

		search: Joi.string().min(1).max(100).optional(),

		filter: Joi.object({
			product_id: Joi.string().optional(),
			inventory_id: Joi.string().optional(),
			operation: Joi.string().valid("add", "reduce").optional(),

			created_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
			updated_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),

			created_range: Joi.object({
				start: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
				end: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
			}).when("created_at", {
				is: Joi.exist(),
				then: Joi.forbidden(),
				otherwise: Joi.optional(),
			}),

			updated_range: Joi.object({
				start: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
				end: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
			}).when("updated_at", {
				is: Joi.exist(),
				then: Joi.forbidden(),
				otherwise: Joi.optional(),
			}),
		}).optional(),
	}),
};

export default productConfigSchema;
