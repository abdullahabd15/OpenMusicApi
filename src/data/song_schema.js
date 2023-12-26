const Joi = require('joi');
const { yearSchema } = require('../utils/utils');

const songSchema = Joi.object({
  title: Joi.string().required(),
  year: yearSchema().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

module.exports = { songSchema };
