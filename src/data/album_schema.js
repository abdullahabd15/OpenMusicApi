import Joi from 'joi';

const albumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

export default albumSchema;
