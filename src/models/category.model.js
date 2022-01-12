const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categoriesSchema = new Schema(
  {
    categoryName: {
      type: String,
    },
    status: {
      type: String,
      default: 'active',
    },
    image: {
      type: String,
    },
    // displayPrice: { type: 'long' },
  },
  { timestamps: true },
)
module.exports = mongoose.model('categories', categoriesSchema)
