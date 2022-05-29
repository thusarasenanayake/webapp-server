const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema(
  {
    usrNumber: {
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
    userName: {
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
    status: {
      type: String,
      default: 'active',
    },
    isAdmin: {
      type: Boolean,
      default: false,
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
