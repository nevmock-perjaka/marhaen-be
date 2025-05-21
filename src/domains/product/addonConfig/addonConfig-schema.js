import Joi from "joi";

const addonConfigSchema = {
    // Schema untuk membuat Add_on_config
    create: Joi.object({
        add_on_id: Joi.string().required(),
        inventory_id: Joi.string().required(),
        operation: Joi.string().valid("add", "reduce").required(),
        value: Joi.number().integer().min(1).required(),
        created_by: Joi.string().required(),
        updated_by: Joi.string().required(),
        owned_by: Joi.string().required(),
        created_at: Joi.date().default(() => new Date()),
        updated_at: Joi.date().default(() => new Date()),
    }),

    // Schema untuk update Add_on_config
    update: Joi.object({
        operation: Joi.string().valid("add", "reduce").optional(),
        value: Joi.number().integer().min(1).optional(),
        updated_by: Joi.string().required(),
        updated_at: Joi.date().default(() => new Date())
    })
};

export default addonConfigSchema;
