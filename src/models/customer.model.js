const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerSchema = new Schema(
  {
    cusNumber: {
      type: Number,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'active',
    },
    dateRegistered: {
      type: Date,
      default: Date.now,
    },
  },
  // { timestamps: true },
)
customerSchema.virtual('id').get(function () {
  return this._id.toHexString()
})
customerSchema.set('toJSON', {
  virtual: true,
})

module.exports = mongoose.model('customer', customerSchema)
