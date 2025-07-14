import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const inventorySchema = {
	// Schema untuk membuat Inventory
	create: Joi.object({
		product_name: Joi.string().min(1).max(100).required(),
		description: Joi.string().allow("").optional(),
		category: Joi.string().required(),
		unit_type: Joi.string().required(), // contoh: "kg", "pcs", "liter", dll
	}),

	// Schema untuk update Inventory
	update: Joi.object({
		product_name: Joi.string().min(1).max(100).optional(),
		description: Joi.string().allow("").optional(),
		category: Joi.string().optional(),
		unit_type: Joi.string().optional(),
	}),

	// Schema untuk params get inventory
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
						.valid(
							"product_name",
							"description",
							"category",
							"unit_type",
							"created_at",
							"updated_at",
						)
						.required(),
					direction: Joi.string().valid("asc", "desc").default("asc"),
				}),
			)
			.optional(),

		include_relation: Joi.array()
			.items(
				Joi.string().valid("Product_config", "Add_on_config", "Input_history"),
			)
			.optional(),

		search: Joi.string().min(1).max(100).optional(),

		filter: Joi.object({
			description: Joi.string().optional(),
			category: Joi.string().optional(),
			unit_type: Joi.string().optional(),

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

export default inventorySchema;
