const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productsSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
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
    rating: {
      type: Number,
    },
    status: {
      type: String,
      default: 'active',
    },
    inStock: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      required: true,
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
