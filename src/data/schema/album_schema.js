const Joi = require('joi');
const { yearSchema } = require('../../utils/utils');

const albumSchema = Joi.object({
  name: Joi.string().required(),
  year: yearSchema().required(),
});

const albumCoverSchema = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ).required(),
}).unknown();

module.exports = { albumSchema, albumCoverSchema };
