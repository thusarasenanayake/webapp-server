const Joi = require('joi')

module.exports = {
  create: {
    body: Joi.object({
      _id: Joi.forbidden(),
      // cusNumber: Joi.number(),
      firstName: Joi.string()
        .required()
        .regex(/^[a-zA-Z]+$/),
      lastName: Joi.string()
        .required()
        .regex(/^[a-zA-Z]+$/),
      email: Joi.string().required().email(),
      password: Joi.string()
        .required()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
      address: Joi.string().required(),
      phoneNumber: Joi.string()
        .required()
        .regex(/^[0-9]+$/),
      confirm: Joi.ref('password'),
    }),
  },
  update: {
    body: Joi.object({
      _id: Joi.forbidden(),
      firstName: Joi.string()
        .required()
        .regex(/^[a-zA-Z]+$/),
      lastName: Joi.string()
        .required()
        .regex(/^[a-zA-Z]+$/),
      email: Joi.string().required().email(),
      address: Joi.string().required(),
      phoneNumber: Joi.string()
        .required()
        .regex(/^[0-9]+$/),
    }),
  },
  reset: {
    body: Joi.object({
      _id: Joi.forbidden(),
      password: Joi.string()
        .required()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
      confirm: Joi.ref('password'),
      current_password: Joi.string().required(),
    }),
  },
  login: {
    body: Joi.object({
      _id: Joi.forbidden(),
      password: Joi.string().required(),
      // .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
      email: Joi.string().required().email(),
    }),
  },
  delete: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
}
