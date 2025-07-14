import JoiDate from "@joi/date";
import JoiBase from "joi";

const Joi = JoiBase.extend(JoiDate);

const addonGroupSchema = {
	// Schema untuk create Add_on_group
	create: Joi.object({
		product_id: Joi.string().required(),
		name: Joi.string().min(1).max(100).required(),
		is_required: Joi.boolean().required(),
		max_selection: Joi.number().integer().min(1).required(),
		is_active: Joi.boolean().default(true),
		add_ons: Joi.array()
			.items(
				Joi.object({
					name: Joi.string().required(),
					price: Joi.number().precision(2).min(0).required(),
					is_active: Joi.boolean().default(true),
				}),
			)
			.optional()
			.default([]),
	}),

	// Schema untuk update Add_on_group
	update: Joi.object({
		name: Joi.string().min(1).max(100).optional(),
		is_required: Joi.boolean().optional(),
		max_selection: Joi.number().integer().min(1).optional(),
		is_active: Joi.boolean().optional(),
		add_ons: Joi.array().items(
			Joi.object({
				id: Joi.string().optional(),
				name: Joi.string().required(),
				price: Joi.number().precision(2).min(0).required(),
				is_active: Joi.boolean().default(true),
			}),
		),
	}),

	// Schema untuk params get addonGroup
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
							"name",
							"is_required",
							"max_selection",
							"is_active",
							"created_at",
							"updated_at",
						)
						.required(),
					direction: Joi.string().valid("asc", "desc").default("asc"),
				}),
			)
			.optional(),

		include_relation: Joi.array()
			.items(Joi.string().valid("Add_on", "product"))
			.optional(),

		search: Joi.string().min(1).max(100).optional(),

		filter: Joi.object({
			is_active: Joi.boolean().truthy("true").falsy("false").optional(),
			is_required: Joi.boolean().truthy("true").falsy("false").optional(),

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

export default addonGroupSchema;
