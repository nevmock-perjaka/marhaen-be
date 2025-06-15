import Joi from "joi";

const addonGroupSchema = {
    // Schema untuk create Add_on_group
    create: Joi.object({
        product_id: Joi.string().required(),
        name: Joi.string().min(1).max(100).required(),
        is_required: Joi.boolean().required(),
        max_selection: Joi.number().integer().min(1).required(),
        is_active: Joi.boolean().default(true),
    }),

    // Schema untuk update Add_on_group
    update: Joi.object({
        name: Joi.string().min(1).max(100).optional(),
        is_required: Joi.boolean().optional(),
        max_selection: Joi.number().integer().min(1).optional(),
        is_active: Joi.boolean().optional(),
    }),
};

export default addonGroupSchema;
