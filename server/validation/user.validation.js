const Joi = require("joi");

const userValidation = {
  register: Joi.object({
    username: Joi.string()
      .min(4)
      .max(30)
      .required()
      .pattern(/^[a-zA-Z0-9_]+$/)
      .messages({
        "string.pattern.base":
          "Username can only contain letters, numbers and underscores",
        "string.min": "Username must be at least 4 characters long",
        "string.max": "Username cannot exceed 30 characters",
        "any.required": "Username is required",
      }),
    password: Joi.string()
      .min(6)
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
      }),
    email: Joi.string().email().messages({
      "string.email": "Please enter a valid email address",
    }),
    // bio: Joi.string().max(160).messages({
    //   "string.max": "Bio cannot exceed 160 characters",
    // }),
    // profilePicture: Joi.string().uri().allow("").messages({
    //   "string.uri": "Profile picture must be a valid URL",
    // }),
  }),

  login: Joi.object({
    username: Joi.string()
      .min(4)
      .max(30)
      .required()
      .pattern(/^[a-zA-Z0-9_]+$/)
      .messages({
        "string.pattern.base":
          "Username can only contain letters, numbers and underscores",
        "string.min": "Username must be at least 4 characters long",
        "string.max": "Username cannot exceed 30 characters",
        "any.required": "Username is required",
      }),
    password: Joi.string()
      .min(6)
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
      }),
  }),

  update: Joi.object({
    username: Joi.string()
      .min(4)
      .max(30)
      .pattern(/^[a-zA-Z0-9_]+$/),
    email: Joi.string().email(),
    bio: Joi.string().max(160),
    profilePicture: Joi.string().uri().allow(""),
  }),
};

module.exports = userValidation;
