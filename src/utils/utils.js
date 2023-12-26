const Joi = require('joi');

const yearSchema = () => Joi.number().integer().min(1900).max(new Date().getFullYear());

module.exports = { yearSchema };
