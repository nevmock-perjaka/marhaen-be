import Joi from "joi";

const createSubscriptionSchema = Joi.object({
    plan_id: Joi.string().required()
        .messages({
            "string.empty": "Plan ID is required."
        }),
});

export { createSubscriptionSchema };