const Joi = require("joi");

const postValidation = {
  create: Joi.object({
    title: Joi.string().min(5).max(100).required().messages({
      "string.min": "Title must be at least 5 characters long",
      "string.max": "Title cannot exceed 100 characters",
      "any.required": "Title is required",
    }),
    summary: Joi.string().min(10).max(200).messages({
      "string.min": "Summary must be at least 10 characters long",
      "string.max": "Summary cannot exceed 200 characters",
    }),
    content: Joi.string().min(50).required().messages({
      "string.min": "Content must be at least 50 characters long",
      "any.required": "Content is required",
    }),
    image: Joi.string().uri().allow("").messages({
      "string.uri": "Image must be a valid URL",
    }),
    tags: Joi.array()
      .items(
        Joi.string()
          .min(2)
          .max(20)
          .pattern(/^[a-zA-Z0-9_-]+$/)
      )
      .max(5)
      .messages({
        "array.max": "Maximum 5 tags allowed",
        "string.pattern.base":
          "Tags can only contain letters, numbers, underscores and hyphens",
      }),
    category: Joi.string()
      .valid("Technology", "Travel", "Food", "Lifestyle", "Other")
      .default("Other")
      .messages({
        "any.only": "Invalid category selected",
      }),
  }),

  update: Joi.object({
    title: Joi.string().min(5).max(100),
    summary: Joi.string().min(10).max(200),
    content: Joi.string().min(50),
    image: Joi.string().uri().allow(""),
    tags: Joi.array()
      .items(
        Joi.string()
          .min(2)
          .max(20)
          .pattern(/^[a-zA-Z0-9_-]+$/)
      )
      .max(5),
    category: Joi.string().valid(
      "Technology",
      "Travel",
      "Food",
      "Lifestyle",
      "Other"
    ),
  }),

  comment: Joi.object({
    text: Joi.string().min(1).max(500).required().messages({
      "string.min": "Comment cannot be empty",
      "string.max": "Comment cannot exceed 500 characters",
      "any.required": "Comment text is required",
    }),
  }),
};

module.exports = postValidation;
