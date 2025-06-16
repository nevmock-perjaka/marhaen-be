import Joi from "joi";

const tableSchema = {
    // Schema untuk membuat Table baru
    create: Joi.object({
        table_desc: Joi.string().min(2).max(100).required(),
        min_capacity: Joi.number().integer().min(1).required(),
        max_capacity: Joi.number().integer().min(Joi.ref('min_capacity')).required(),
        image_uri: Joi.string().optional().allow(null, ""),
        identifier_table: Joi.string().required(),
        is_outdoor: Joi.boolean().default(false),
        is_active: Joi.boolean().default(true),
        barcode: Joi.string().required(),
    }),

    // Schema untuk update Table
    update: Joi.object({
        min_capacity: Joi.number().integer().min(1).optional(),
        max_capacity: Joi.number().integer().min(1).optional(),
        image_uri: Joi.string().optional().allow(null, ""),
        identifier_table: Joi.string().optional(),
        table_desc: Joi.string().min(2).max(100).required(),
        is_outdoor: Joi.boolean().optional(),
        is_active: Joi.boolean().optional(),
        barcode: Joi.string().optional(),
    })
};

export default tableSchema;
