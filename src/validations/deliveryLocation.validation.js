const Joi = require('joi')
module.exports = {
  create: {
    body: Joi.object({
      _id: Joi.forbidden(),
      cityName: Joi.string()
        .required()
        .regex(/^[a-zA-Z]+$/),
      charges: Joi.string()
        .required()
        .regex(/^[0-9]+$/),
    }),
  },
  update: {
    body: Joi.object({
      _id: Joi.string().required(),
      city: Joi.string()
        .required()
        .regex(/^[a-zA-Z]+$/),
      price: Joi.number().required(),
      status: Joi.string()
        .required()
        .regex(/^[a-zA-Z]+$/),
      createdAt: Joi.date(),
      updatedAt: Joi.date(),
    }),
  },
  delete: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
}
