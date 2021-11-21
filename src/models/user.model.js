const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema(
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
    phoneNumber: {
      type: Number,
    },
    houseNumber: {
      type: String,
    },
    streetName: {
      type: String,
    },
    city: {
      type: String,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
      default: 'active',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'employee',
      enum: ['admin', 'employee'],
    },
  },
  { timestamps: true },
)
usersSchema.virtual('id').get(function () {
  return this._id.toHexString()
})
usersSchema.set('toJSON', {
  virtual: true,
})

module.exports = mongoose.model('users', usersSchema)
