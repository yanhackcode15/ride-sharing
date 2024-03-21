const Joi = require('joi');

const availabilitySchema = Joi.object({
  availability: Joi.boolean().required()
});

const validateDriverAvailability = (req, res, next) => {
  const { error } = availabilitySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateDriverAvailability;
