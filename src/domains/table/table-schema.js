import Joi from "joi";

const tableSchema = {
    // Schema untuk membuat Table baru
    create: Joi.object({
        min_capacity: Joi.number().integer().min(1).required(),
        max_capacity: Joi.number().integer().min(Joi.ref('min_capacity')).required(),
        image_uri: Joi.string().uri().optional().allow(null, ""),
        identifier_table: Joi.string().required(),
        is_outdoor: Joi.boolean().default(false),
        is_active: Joi.boolean().default(true),
        barcode: Joi.string().required(),
        created_by: Joi.string().required(),
        updated_by: Joi.string().required(),
        owned_by: Joi.string().required(),
        created_at: Joi.date().default(() => new Date()),
        updated_at: Joi.date().default(() => new Date())
    }),

    // Schema untuk update Table
    update: Joi.object({
        min_capacity: Joi.number().integer().min(1).optional(),
        max_capacity: Joi.number().integer().min(1).optional(),
        image_uri: Joi.string().uri().optional().allow(null, ""),
        identifier_table: Joi.string().optional(),
        is_outdoor: Joi.boolean().optional(),
        is_active: Joi.boolean().optional(),
        barcode: Joi.string().optional(),
        updated_by: Joi.string().required(),
        updated_at: Joi.date().default(() => new Date())
    })
};

export default tableSchema;
