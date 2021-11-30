const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    status: {
      type: String,
      default: 'active',
    },
  },
  { timestamps: true },
)
customerSchema.virtual('id').get(function () {
  return this._id.toHexString()
})
customerSchema.set('toJSON', {
  virtual: true,
})

module.exports = mongoose.model('customer', customerSchema)
