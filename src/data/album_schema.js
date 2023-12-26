const Joi = require('joi');
const { yearSchema } = require('../utils/utils');

const albumSchema = Joi.object({
  name: Joi.string().required(),
  year: yearSchema().required(),
});

module.exports = { albumSchema };
