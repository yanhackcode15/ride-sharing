const Joi = require('joi');

// Define the schema based on the user model
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // Example: Passwords must be at least 6 characters long
  role: Joi.string().valid('rider', 'driver').required(),
  driverAvailability: Joi.boolean(),
  vehicleInfo: Joi.when('role', { is: 'driver', then: Joi.object({
    make: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    licensePlate: Joi.string().required()
  }).required() }),
  driverLicense: Joi.when('role', { is: 'driver', then: Joi.object({
    licenseNumber: Joi.string().required(),
    validUntil: Joi.date().greater('now').required()
  }).required() }),
});

// Middleware to validate user data
const validateUserData = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateRegistrationData;
