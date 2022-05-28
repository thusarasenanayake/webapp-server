const Joi = require('joi')
module.exports = {
  create: {
    body: Joi.object({
      _id: Joi.forbidden(),
      isAdmin: Joi.forbidden(),
      status: Joi.forbidden(),
      firstName: Joi.string()
        .required()
        .regex(/^[a-zA-Z]+$/),
      lastName: Joi.string()
        .required()
        .regex(/^[a-zA-Z]+$/),
      userName: Joi.string().required(),
      password: Joi.string().required(),
      Password2: Joi.ref('password'),
      email: Joi.string().required().email(),
    }),
  },

  update: {
    body: Joi.object({
      _id: Joi.string(),
      firstName: Joi.string()
        .required()
        .regex(/^[a-zA-Z]+$/),
      lastName: Joi.string()
        .required()
        .regex(/^[a-zA-Z]+$/),
      userName: Joi.string().required(),
    }),
  },

  login: {
    body: Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },

  reset: {
    body: Joi.object({
      current_password: Joi.string().required(),
      Password2: Joi.ref('password'),
      password: Joi.string().required(),
    }),
  },
}
