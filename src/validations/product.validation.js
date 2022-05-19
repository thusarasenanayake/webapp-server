const Joi = require('joi')
module.exports = {
  create: {
    body: Joi.object({
      _id: Joi.forbidden(),
      productName: Joi.string()
        .required()
        .regex(/^[a-zA-Z0-9 ]+$/),
      price: Joi.number().required(),
      category_id: Joi.string().required(),
      inStock: Joi.number().required(),
    }),
  },
  update: {
    body: Joi.object({
      _id: Joi.forbidden(),
      productName: Joi.string()
        .required()
        .regex(/^[a-zA-Z0-9 ]+$/),
      price: Joi.number().required(),
      category_id: { _id: Joi.string().required() },
      inStock: Joi.number().required(),
    }),
  },
}
