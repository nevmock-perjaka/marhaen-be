import Joi from "joi";

const orderItemAddonSchema = {
	// Schema untuk create
	create: Joi.object({
		order_id: Joi.string().required(),
		product_id: Joi.string().required(),
		price: Joi.number().precision(2).min(0).required(),
		created_by: Joi.string().required(),
		updated_by: Joi.string().required(),
		owned_by: Joi.string().required(),
		created_at: Joi.date().default(() => new Date()),
		updated_at: Joi.date().default(() => new Date()),
	}),

	// Schema untuk update
	update: Joi.object({
		price: Joi.number().precision(2).min(0).optional(),
		updated_by: Joi.string().required(),
		updated_at: Joi.date().default(() => new Date()),
	}),
};

export default orderItemAddonSchema;
