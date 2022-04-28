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
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'deliveryArea',
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'processing',
  },
  totalPrice: {
    type: Number,
    required: true,

  },
  subTotalPrice: {
    type: Number,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  dateOrder: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('order', orderSchema)
