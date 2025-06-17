import Joi from "joi";

const midtransSchema = Joi.object({
  secret_key: Joi.string().max(50).optional().messages({
    'string.max': 'Secret Key must be at most 50 characters long.',
    'string.base': 'Secret Key must be a string.'
  }),
  client_key: Joi.string().max(50).optional().messages({
    'string.max': 'Client Key must be at most 50 characters long.',
    'string.base': 'Client Key must be a string.'
  }),
  is_production: Joi.boolean().optional().messages({
    'boolean.base': 'Is Production must be a boolean value.'
  }),
});

export { midtransSchema };