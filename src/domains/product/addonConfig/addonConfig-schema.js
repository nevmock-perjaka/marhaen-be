import Joi from "joi";

const addonConfigSchema = {
	// Schema untuk membuat Add_on_config
	create: Joi.object({
		add_on_id: Joi.string().required(),
		config: Joi.array()
			.items(
				Joi.object({
					inventory_id: Joi.string().required(),
					operation: Joi.string().valid("add", "reduce").required(),
					value: Joi.number().integer().min(1).required(),
				}),
			)
			.required(),
	}),

	// Schema untuk update Add_on_config
	update: Joi.object({
		add_on_id: Joi.string().required(),
		config: Joi.array()
			.items(
				Joi.object({
					inventory_id: Joi.string().required(),
					operation: Joi.string().valid("add", "reduce").required(),
					value: Joi.number().integer().min(1).required(),
				}),
			)
			.required(),
	}),
};

export default addonConfigSchema;
