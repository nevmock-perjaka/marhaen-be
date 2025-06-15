import Joi from "joi";

const inventorySchema = {
    // Schema untuk membuat Inventory
    create: Joi.object({
        product_name: Joi.string().min(1).max(100).required(),
        description: Joi.string().allow("").optional(),
        category: Joi.string().required(),
        unit_type: Joi.string().required(), // contoh: "kg", "pcs", "liter", dll
    }),

    // Schema untuk update Inventory
    update: Joi.object({
        product_name: Joi.string().min(1).max(100).optional(),
        description: Joi.string().allow("").optional(),
        category: Joi.string().optional(),
        unit_type: Joi.string().optional(),
    })
};

export default inventorySchema;
