const { required } = require('joi')
const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
  customerID: {
    type: String,
    ref: 'customer',
    required: true,
  },
  customerEmail: {
    type: mongoose.Schema.Types.String,
    ref: 'customer',
    required: true,
  },
  cartItem: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
      },
      quantity: {
        type: Number,
      },
    },
  ],
  status: {
    type: String,
    default: 'active',
  },
})

module.exports = mongoose.model('cart', cartSchema)
