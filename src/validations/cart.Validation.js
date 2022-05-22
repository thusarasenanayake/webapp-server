const Joi = require('joi')

module.exports = {
  update: {
    body: Joi.object({
      _id: Joi.forbidden(),
      categoryName: Joi.string()
        .required()
        .regex(/^[a-zA-Z ]+$/),
      image: Joi.string().required(),
    }),
  },
  add: {
    body: Joi.object({
      _id: Joi.forbidden(),
      productID: Joi.string().required(),
      quantity: Joi.number().required(),
    }),
  },
}
