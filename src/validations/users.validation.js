const Joi = require('joi')
module.exports = {
  create: {
    body: Joi.object({
      _id: Joi.forbidden(),
      firstName: Joi.string().required().regex(/^[a-zA-Z]/).alphanum().min(3),
      lastName: Joi.string().required().regex(/^[a-zA-Z]/).alphanum().min(3),
      userName: Joi.string().required(),
      password: Joi.string().required().min(4).max(7),
    }),
  },
}
