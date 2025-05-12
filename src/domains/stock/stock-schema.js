import Joi from "joi";

const createStockSchema = Joi.object({
    product_id: Joi.string().required().messages({
        "string.empty": "Product ID is required."
    }),
    quantity: Joi.number().integer().required().messages({
        "number.base": "Quantity must be a number.",
        "number.integer": "Quantity must be an integer.",
        "any.required": "Quantity is required."
    })
});

const updateStockSchema = Joi.object({
    quantity: Joi.number().integer().required().messages({
        "number.base": "Quantity must be a number.",
        "number.integer": "Quantity must be an integer.",
        "any.required": "Quantity is required."
    })
});

export { createStockSchema, updateStockSchema };
