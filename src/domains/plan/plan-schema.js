import Joi from "joi";

const createPlanSchema = Joi.object({
    name: Joi.string().min(3).required()
        .messages({
            "string.base": "Name must be a string.",
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 3 characters long.",
            "any.required": "Name is required."
        }),
    days: Joi.number().integer().options({ convert: false }).min(0).required()
        .messages({
            "number.base": "Days must be a number.",
            "number.integer": "Days must be an integer.",
            "number.min": "Days must be at least 0.",
            "any.required": "Days is required."
        }),
    price: Joi.number().integer().options({ convert: false }).min(0).required()
        .messages({
            "number.base": "Price must be a number.",
            "number.integer": "Price must be an integer.",
            "number.min": "Price must be at least 0.",
            "any.required": "Price is required."
        }),
    level: Joi.number().min(0).max(1).required()
        .messages({
            "number.base": "Level must be a number.",
            "number.min": "Level must be at least 0.",
            "number.max": "Level must be at most 1.",
            "any.required": "Level is required."
        }),
});


const updatePlanSchema = Joi.object({
    name: Joi.string().min(3).optional()
        .messages({
            "string.base": "Name must be a string.",
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 3 characters long.",
        }),
    days: Joi.number().integer().options({ convert: false }).min(0).optional()
        .messages({
            "number.base": "Days must be a number.",
            "number.integer": "Days must be an integer.",
            "number.min": "Days must be at least 0.",
        }),
    price: Joi.number().integer().options({ convert: false }).min(0).optional()
        .messages({
            "number.base": "Price must be a number.",
            "number.integer": "Price must be an integer.",
            "number.min": "Price must be at least 0.",
        }),
    level: Joi.number().min(0).max(1).optional()
        .messages({
            "number.base": "Level must be a number.",
            "number.min": "Level must be at least 0.",
            "number.max": "Level must be at most 1.",
        }),
    is_active: Joi.boolean().optional()
        .messages({
            "boolean.base": "is_active must be a boolean value (true or false)."
        })
});


export { createPlanSchema, updatePlanSchema };