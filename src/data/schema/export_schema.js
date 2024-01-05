const Joi = require('joi');

const exportSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = exportSchema;
