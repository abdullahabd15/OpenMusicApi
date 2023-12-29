const Joi = require('joi');

const authenticationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { authenticationSchema, refreshTokenSchema };
