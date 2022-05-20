const Joi = require('joi')

module.exports = {
  create: {
    body: Joi.object({
      _id: Joi.forbidden(),
      categoryName: Joi.string()
        .required()
        .regex(/^[a-zA-Z ]+$/),
      image: Joi.string().required(),
    }),
  },
  update: {
    body: Joi.object({
      _id: Joi.forbidden(),
      categoryName: Joi.string()
        .required()
        .regex(/^[a-zA-Z ]+$/),
      image: Joi.string().required(),
    }),
  },
}
