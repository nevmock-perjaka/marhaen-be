import Joi from "joi";

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
    })
};

export default productConfigSchema;
