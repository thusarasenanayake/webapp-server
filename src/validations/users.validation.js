const Joi = require('joi')
const role = ['admin', 'employee']
module.exports = {
  create: {
    body: Joi.object({
      _id: Joi.forbidden(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      streetName: Joi.string().required(),
      houseNumber: Joi.string().required(),
      city: Joi.string().required(),
      phoneNumber: Joi.number().required(),
      isAdmin: Joi.boolean().required(),
      role: Joi.string()
        .valid(...role)
        .required(),
    }),
  },
}
