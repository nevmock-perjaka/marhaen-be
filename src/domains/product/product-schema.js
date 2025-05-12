import Joi from "joi";

const createProductSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Name is required."
    }),
    category_id: Joi.string().required().messages({
        "string.empty": "Category ID is required."
    }),
    price: Joi.number().required().messages({
        "number.base": "Price must be a number.",
        "any.required": "Price is required."
    }),
    description: Joi.string().optional()
});

const updateProductSchema = Joi.object({
    name: Joi.string().optional(),
    category_id: Joi.string().optional(),
    price: Joi.number().optional(),
    description: Joi.string().optional()
});

export { createProductSchema, updateProductSchema };
