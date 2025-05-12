import Joi from "joi";

const createCategorySchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Category name is required"
    })
});

const updateCategorySchema = Joi.object({
    name: Joi.string().optional()
});

export { createCategorySchema, updateCategorySchema };
