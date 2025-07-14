import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const orderSchema = {
	// Schema untuk membuat Order
	create: Joi.object({
		order_by: Joi.string().required(),
		phone_number: Joi.string().optional().allow(null, ""),
		table_id: Joi.string().optional().allow(null, ""),
		shareable_code: Joi.string().optional().allow(null, ""),
		order_items: Joi.array()
			.items(
				Joi.object({
					product_id: Joi.string().required(),
					quantity: Joi.number().integer().min(1).required(),
					note: Joi.string().allow("").optional(),
					order_item_add_ons: Joi.array()
						.items(Joi.string())
						.optional()
						.default([]),
				}),
			)
			.required()
			.min(1),
	}),

	// Schema untuk params get order
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
							"order_by",
							"phone_number",
							"status",
							"total_gross",
							"created_at",
						)
						.required(),
					direction: Joi.string().valid("asc", "desc").default("asc"),
				}),
			)
			.optional(),

		include_relation: Joi.array()
			.items(
				Joi.string().valid(
					"table",
					"discount",
					"Order_item",
					"Order_transaction",
				),
			)
			.optional(),

		search: Joi.alternatives()
			.try(Joi.string().min(1).max(100), Joi.number().integer())
			.optional(),

		filter: Joi.object({
			status: Joi.string().optional(),
			order_by: Joi.string().optional(),

			is_null: Joi.array().items(Joi.string().valid("table_id")).optional(),
			is_not_null: Joi.array().items(Joi.string().valid("table_id")).optional(),

			total_gross_range: Joi.object({
				min: Joi.number().precision(2).min(0).optional(),
				max: Joi.number().precision(2).min(0).optional(),
			}).when("total_gross", {
				is: Joi.exist(),
				then: Joi.forbidden(),
				otherwise: Joi.optional(),
			}),

			total_gross: Joi.number().precision(2).min(0).optional(),

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
		})
			.optional()
			.custom((value, helpers) => {
				const isNull = new Set(value.is_null || []);
				const isNotNull = new Set(value.is_not_null || []);

				const conflict = [...isNull].filter((f) => isNotNull.has(f));

				if (conflict.length > 0) {
					return helpers.message(
						`Field(s) [${conflict.join(", ")}] cannot be in both 'is_null' and 'is_not_null'`,
					);
				}

				return value;
			}),
	}),
};

export default orderSchema;
