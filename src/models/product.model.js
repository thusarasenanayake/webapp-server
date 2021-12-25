const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productsSchema = new Schema(
  {
    productName: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      default: 0,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    countInstock: {
      type: Number,
      min: 0,
      max: 255,
    },
    rating: {
      type: Number,
    },
    status: {
      type: String,
      default: 'active',
    },
    dateCreated: {
      type: Date,
    },
  },
  { timestamps: true },
)

productsSchema.virtual('id').get(function () {
  return this._id.toHexString()
})
productsSchema.set('toJSON', {
  virtual: true,
})

module.exports = mongoose.model('products', productsSchema)
