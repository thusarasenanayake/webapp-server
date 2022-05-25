const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deliveryAreaSchema = new Schema(
  {
    city: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'active',
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
)
module.exports = mongoose.model('deliveryArea', deliveryAreaSchema)
