import Joi from "joi";

const baseFields = {
    name: Joi.string().min(2).max(100).required(),
    price: Joi.number().precision(2).min(0).required(),
    description: Joi.string().allow("").max(255),
    category: Joi.string().required(),
    image_uri: Joi.string().uri().required(),
    is_active: Joi.boolean().default(true),
    created_by: Joi.string().required(),
    updated_by: Joi.string().required(),
    owned_by: Joi.string().required()
};

const productSchema = {
    // Schema saat create
    create: Joi.object({
        ...baseFields,
        created_at: Joi.date().default(() => new Date()),
        updated_at: Joi.date().default(() => new Date())
    }),

    // Schema saat update
    update: Joi.object({
        name: baseFields.name.optional(),
        price: baseFields.price.optional(),
        description: baseFields.description.optional(),
        category: baseFields.category.optional(),
        image_uri: baseFields.image_uri.optional(),
        is_active: baseFields.is_active.optional(),
        updated_by: baseFields.updated_by.required(),
        owned_by: baseFields.owned_by.optional(),
        updated_at: Joi.date().default(() => new Date())
    })
};

export default productSchema;
