const Joi = require('joi')
const role = ['admin', 'employee']
module.exports = {
  create: {
    body: Joi.object({
      _id: Joi.forbidden(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      userName: Joi.string().required(),
      password: Joi.string().required(),
      confirm: Joi.string(),
    }),
  },
}
