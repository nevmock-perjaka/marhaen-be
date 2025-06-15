import Joi from "joi";

const baseFields = {
    name: Joi.string().min(2).max(100).required(),
    price: Joi.number().precision(2).min(0).required(),
    description: Joi.string().allow("").max(255),
    category: Joi.string().required(),
    image_uri: Joi.string().required(),
    is_active: Joi.boolean().default(true),
};

const productSchema = {
    // Schema saat create
    create: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        price: Joi.number().precision(2).min(0).required(),
        description: Joi.string().allow("").max(255),
        category: Joi.string().required(),
        image_uri: Joi.string().required(),
        is_active: Joi.boolean().default(true),
    }),

    // Schema saat update
    update: Joi.object({
        name: baseFields.name.optional(),
        price: baseFields.price.optional(),
        description: baseFields.description.optional(),
        category: baseFields.category.optional(),
        image_uri: baseFields.image_uri.optional(),
        is_active: baseFields.is_active.optional(),
    })
};

export default productSchema;
