import Joi from "joi";

const loginSchema = Joi.object({
    email : Joi.string()
        .required()
        .messages({
            "string.empty": "Email is required."
        }),
    password : Joi.string()
        .required()
        .messages({
            "string.empty": "Password is required."
        })
});

const registerSchema = Joi.object({
    name : Joi.string().required().min(4)
        .messages({
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 4 characters long."
        }),
    email : Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required.",
            "string.email": "Email must be a valid email address."
        }),
    otp_verification : Joi.number()
        .required()
        
        .messages({
            "string.empty": "OTP verification is required."
        }),
    phone_number : Joi.string()
        .required()
        .regex(/^\+?[0-9]{10,15}$/)
        .messages({
            "string.empty": "Phone number is required.",
            "string.pattern.base": "Phone number must be a valid phone number."
    }),
    password : Joi.string()
        .required()
        .min(8)
        .pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
        .messages({
            "string.empty": "Passw2ord is required.",
            "string.min": "Password must be at least 8 characters long.",
            "string.pattern.base": "Password must be at least 8 characters long, contain at least 1 uppercase letter, and 1 special character."
        }),
    password_confirmation : Joi.string()
        .required()
        .valid(Joi.ref("password"))
        .messages({
            "string.empty": "Password confirmation is required.",
            "any.only": "Password confirmation does not match password."
        }),
});

const profileSchema = Joi.object({
    name : Joi.string().required().min(4)
        .messages({
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 4 characters long."
        }),
}) 

const sendOtpSchema = Joi.object({
    email : Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required.",
            "string.email": "Email must be a valid email address."
        }),
})

const refreshTokenSchema = Joi.object({
    refresh_token : Joi.string()
        .required()
        .messages({
            "string.empty": "Refresh token is required."
        }),
})

export { loginSchema, registerSchema, profileSchema, sendOtpSchema, refreshTokenSchema };