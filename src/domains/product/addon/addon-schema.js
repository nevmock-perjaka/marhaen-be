import Joi from "joi";

const addonSchema = {
    // Schema untuk membuat Add_on
    create: Joi.object({
        add_on_group_id: Joi.string().required(),
        name: Joi.string().min(1).max(100).required(),
        price: Joi.number().precision(2).min(0).required(),
        is_active: Joi.boolean().default(true),
    }),

    // Schema untuk update Add_on
    update: Joi.object({
        name: Joi.string().min(1).max(100).optional(),
        price: Joi.number().precision(2).min(0).optional(),
        is_active: Joi.boolean().optional(),
        updated_by: Joi.string().required(),
        updated_at: Joi.date().default(() => new Date())
    })
};

export default addonSchema;
