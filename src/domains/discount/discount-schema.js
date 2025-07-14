import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const discountSchema = {
	// Schema untuk create Discount
	create: Joi.object({
		description: Joi.string().required(),
		is_percentage: Joi.boolean().default(false),
		value: Joi.alternatives().conditional("is_percentage", {
			is: true,
			then: Joi.number().precision(2).min(0).max(100).required(),
			otherwise: Joi.number().precision(2).min(0).required(),
		}),
		max_discount: Joi.number().precision(2).min(0).when("is_percentage", {
			is: true,
			then: Joi.required(),
			otherwise: Joi.forbidden(),
		}),
		min_order_amount: Joi.number().precision(2).min(0).required(),
		shareable_code: Joi.string().required(),
		max_use: Joi.number().integer().min(1).optional(),
		start_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").required(),
		expired_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").required(),
		is_active: Joi.boolean().default(true),
	}),

	// Schema untuk update Discount
	update: Joi.object({
		description: Joi.string().optional(),
		is_percentage: Joi.boolean().default(false),
		value: Joi.alternatives().conditional("is_percentage", {
			is: true,
			then: Joi.number().precision(2).min(0).max(100).required(),
			otherwise: Joi.number().precision(2).min(0).required(),
		}),
		max_discount: Joi.number().precision(2).min(0).when("is_percentage", {
			is: true,
			then: Joi.required(),
			otherwise: Joi.forbidden(),
		}),
		min_order_amount: Joi.number().precision(2).min(0).optional(),
		max_use: Joi.number().integer().min(1).optional(),
		expired_at: Joi.date().format("YYYY-MM-DD HH:mm:ss").optional(),
		is_active: Joi.boolean().optional(),
	}),

	// Schema untuk params get discount
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
							"min_order_amount",
							"max_discount",
							"value",
							"max_use",
							"used",
							"start_at",
							"shareable_code",
							"is_active",
							"is_percentage",
							"expired_at",
							"created_at",
							"updated_at",
						)
						.required(),
					direction: Joi.string().valid("asc", "desc").default("asc"),
				}),
			)
			.optional(),

		include_relation: Joi.array()
			.items(Joi.string().valid("Product_discount", "Order"))
			.optional(),

		search: Joi.string().min(1).max(100).optional(),

		filter: Joi.object({
			is_active: Joi.boolean().truthy("true").falsy("false").optional(),
			is_percentage: Joi.boolean().truthy("true").falsy("false").optional(),
			max_discount: Joi.number().precision(2).min(0).optional(),
			min_order_amount: Joi.number().precision(2).min(0).optional(),

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

export default discountSchema;
