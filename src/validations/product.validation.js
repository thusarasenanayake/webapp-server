const Joi = require('joi')
module.exports = {
  create: {
    body: Joi.object({
      _id: Joi.forbidden(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      richDescription: Joi.string(),
      image: Joi.string(),
      images: Joi.string(),
      price: Joi.number().required(),
      category: Joi.string().required(),
      countInstock: Joi.number(),
      rating: Joi.number(),
      dateCreated: Joi.string(),
    }),
  },
}
