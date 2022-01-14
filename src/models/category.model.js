const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categoriesSchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'active',
    },
    image: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    displayPrice: { type: Number, required: true },
  },
  { timestamps: true },
)
module.exports = mongoose.model('categories', categoriesSchema)
