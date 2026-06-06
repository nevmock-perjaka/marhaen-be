import Joi from "joi";

const midtransSchema = Joi.object({
	server_key: Joi.string().max(50).optional().messages({
		"string.max": "Server Key must be at most 50 characters long.",
		"string.base": "Server Key must be a string.",
	}),
	client_key: Joi.string().max(50).optional().messages({
		"string.max": "Client Key must be at most 50 characters long.",
		"string.base": "Client Key must be a string.",
	}),
	is_production: Joi.boolean().optional().messages({
		"boolean.base": "Is Production must be a boolean value.",
	}),
});

export { midtransSchema };
