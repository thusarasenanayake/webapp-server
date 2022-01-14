const Joi = require('joi')

module.exports = {
  create: {
    body: Joi.object({
      _id: Joi.forbidden(),
      categoryName: Joi.string().required(),
      image: Joi.string(),
      price: Joi.number(),
    }),
  },
}
