const Joi = require("joi");

const registerSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "Missing required password field",
  }),
  email: Joi.string().required().messages({
    "any.required": "Missing required email field",
  }),
  subscription: Joi.string(),
});

const loginSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "Missing required password field",
  }),
  email: Joi.string().required().messages({
    "any.required": "Missing required email field",
  }),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.valid("starter", "pro", "business").required().messages({
    "any.required": "Missing required field subscription",
    "any.only": "Invalid subscription type. Allowed types: starter, pro, business",
  }),
});

const resendVerificationEmailSchema = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "Missing required email field",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
  resendVerificationEmailSchema,
};
