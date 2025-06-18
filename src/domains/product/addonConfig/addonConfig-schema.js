import Joi from "joi";

const addonConfigSchema = {
    // Schema untuk membuat Add_on_config
    create: Joi.object({
        add_on_id: Joi.string().required(),
        inventory_id: Joi.string().required(),
        operation: Joi.string().valid("add", "reduce").required(),
        value: Joi.number().integer().min(1).required(),
    }),

    // Schema untuk update Add_on_config
    update: Joi.object({
        operation: Joi.string().valid("add", "reduce").optional(),
        value: Joi.number().integer().min(1).optional(),
    })
};

export default addonConfigSchema;
