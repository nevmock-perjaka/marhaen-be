import Joi from "joi";

const productDiscountSchema = {
	// Schema untuk create Product_discount
	create: Joi.object({
		product_id: Joi.string().required(),
		discount_id: Joi.string().required(),
		created_by: Joi.string().required(),
		updated_by: Joi.string().required(),
		owned_by: Joi.string().required(),
		created_at: Joi.date().default(() => new Date()),
		updated_at: Joi.date().default(() => new Date()),
	}),

	// Schema untuk update Product_discount
	update: Joi.object({
		product_id: Joi.string().optional(),
		discount_id: Joi.string().optional(),
		updated_by: Joi.string().required(),
		updated_at: Joi.date().default(() => new Date()),
	}),
};

export default productDiscountSchema;
