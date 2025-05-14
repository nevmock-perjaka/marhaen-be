import Joi from "joi";

const productConfigSchema = {
    // Schema untuk create Product_config
    create: Joi.object({
        product_id: Joi.string().required(),
        inventory_id: Joi.string().required(),
        operation: Joi.string().valid("plus", "minus").required(),
        value: Joi.number().integer().min(1).required(),
        created_by: Joi.string().required(),
        updated_by: Joi.string().required(),
        owned_by: Joi.string().required(),
        created_at:  Joi.date().default(() => new Date()),
        updated_at: Joi.date().default(() => new Date())
    }),

    // Schema untuk update Product_config
    update: Joi.object({
        operation: Joi.string().valid("plus", "minus").optional(),
        value: Joi.number().integer().min(1).optional(),
        updated_by: Joi.string().required(),
        updated_at: Joi.date().default(() => new Date())
    })
};

export default productConfigSchema;
