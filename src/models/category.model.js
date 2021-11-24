const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categoriesSchema = new Schema(
  {
    categoryName: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
)
module.exports = mongoose.model('categories', categoriesSchema)
