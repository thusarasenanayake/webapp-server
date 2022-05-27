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
  orderNumber: {
    type: Number,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'deliveryArea',
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
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
  orderedUser: {
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
    // default: Date.now,
  },
})

module.exports = mongoose.model('order', orderSchema)
