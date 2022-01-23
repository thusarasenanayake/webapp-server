const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  orderItem: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orderitems',
      required: true,
    },
  ],
  shippingAddress: {
    type: String,
    required: true,
  },
  // city: {
  //   type: String,
  //   required: true,
  // },
  phoneNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
  totalPrice: {
    type: Number,
  },
  ReceiverName: {
    type: String,
  },
  Landmark: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    required: true,
  },
  dateOrder: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('order', orderSchema)
