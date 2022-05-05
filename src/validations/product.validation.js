const Joi = require('joi')
module.exports = {
  create: {
    body: Joi.object({
      _id: Joi.forbidden(),
      productName: Joi.string().required().regex(/^[a-zA-Z ]+$/),
      price: Joi.number().required(),
      category_id: Joi.string().required(),
      inStock: Joi.number().required(),
    }),
  },
}
