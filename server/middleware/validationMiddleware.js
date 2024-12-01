const Joi = require("joi");

/**
 * Middleware to validate input data (dtoIn) for API endpoints
 * @param {Object} schema - Joi validation schema
 * @returns Middleware function
 */

const validateDtoIn = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false }); // Validate request body
  if (error) {
    return res.status(400).json({
      errorMap: {
        code: "INVALID_DTO_IN",
        message: error.details.map((detail) => detail.message).join(", "),
      },
    });
  }
  req.validatedBody = value;
  next(); 
};

module.exports = validateDtoIn;