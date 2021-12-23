const Joi = require('joi')
module.exports = {
  create: {
    body: Joi.object({
      _id: Joi.forbidden(),
      productName: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string(),
      // images: Joi.string(),
      price: Joi.number().required(),
      category_id: Joi.string().required(),
      // countInstock: Joi.number(),
      // rating: Joi.number(),
      // dateCreated: Joi.string(),
    }),
  },
}
