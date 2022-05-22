const Joi = require('joi')

module.exports = {
  create: {
    body: Joi.object({
      _id: Joi.forbidden(),
      orderData: Joi.array().items({
        productID: Joi.string().required(),
        productName: Joi.string().required(),
        quantity: Joi.number().required(),
        inStock: Joi.number().required(),
        price: Joi.number().required(),
      }),

      data: {
        shippingAddress: Joi.string().required(),
        city: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        landmark: Joi.string(),
        receiverName: Joi.string().required(),
      },
    }),
  },
  update: {
    body: Joi.object({
      _id: Joi.forbidden(),
      status: Joi.string().required(),
    }),
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
}
