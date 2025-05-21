import Joi from "joi";

const inventorySchema = {
    // Schema untuk membuat Inventory
    create: Joi.object({
        product_name: Joi.string().min(1).max(100).required(),
        description: Joi.string().allow("").optional(),
        category: Joi.string().required(),
        unit_type: Joi.string().required(), // contoh: "kg", "pcs", "liter", dll
        created_by: Joi.string().required(),
        updated_by: Joi.string().required(),
        owned_by: Joi.string().required(),
        created_at: Joi.date().default(() => new Date()),
        updated_at: Joi.date().default(() => new Date())
    }),

    // Schema untuk update Inventory
    update: Joi.object({
        product_name: Joi.string().min(1).max(100).optional(),
        description: Joi.string().allow("").optional(),
        category: Joi.string().optional(),
        unit_type: Joi.string().optional(),
        updated_by: Joi.string().required(),
        updated_at: Joi.date().default(() => new Date())
    })
};

export default inventorySchema;
