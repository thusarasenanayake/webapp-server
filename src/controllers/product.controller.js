const Product = require('../models/product.model')
const Category = require('../models/category.model')
const httpStatus = require('http-status')
const permission = require('../middlewares/permissionLevel')

exports.create = async (req, res, next) => {
  await permission(req.user, res, true) //admin

  try {
    const categoryID = req.body.category_id
    const category = await Category.findById(categoryID)
    const product = await Product.findOne({ productName: req.body.productName })
    if (product) {
      return res.status(httpStatus.CONFLICT).json('Already exits')
    }
    if (!category) {
      return res.status(httpStatus.BAD_REQUEST).json('Invalid Category')
    } else {
      const productData = new Product({
        productName: req.body.productName,
        price: req.body.price,
        category_id: req.body.category_id,
        inStock: req.body.inStock,
      })
      await productData.save()
      return res.status(httpStatus.CREATED).json({ productData })
    }
  } catch (error) {
    next(error)
  }
}

exports.view = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
      .select('-__v -status -createdAt -updatedAt -isAvailable')
      .populate({ path: 'category_id', model: Category, select: '_id' })
    if (!product) {
      throw Error('Product not found!!')
    }
    return res.status(httpStatus.OK).json({ product })
  } catch (error) {
    next(error)
  }
}

exports.list = async (req, res, next) => {
  try {
    let filter = {}
    if (req.query.categories) {
      filter = { category: req.query.categories.split(',') }
    }
    const query = Product.find(filter)
      .where('status')
      .equals('active')
      .select('-__v -createdAt -updatedAt -isAvailable')
      .populate({ path: 'category_id', model: Category })
      .sort('inStock')
    const products = await query.exec()
    if (products.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send('no products found')
    }
    return res.status(httpStatus.OK).json({ products })
  } catch (error) {
    next(error)
  }
}

//update countStocks, instock status and price
exports.update = async (req, res, next) => {
  try {
    const checkProduct = await Product.findOne({
      productName: req.body.productName,
    }).select('_id')
    if (checkProduct) {
      if (checkProduct._id.toString() !== req.params.id) {
        return res.status(httpStatus.CONFLICT).json('Already exits')
      }
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        inStock: req.body.inStock,
        category_id: req.body.category_id,
        price: req.body.price,
        productName: req.body.productName,
      },
      { new: true },
    )
    if (!product) {
      return res.status(httpStatus.NOT_FOUND).send('Product not found!!')
    }
    return res.status(httpStatus.OK).json({ product })
  } catch (error) {
    next(error)
  }
}
exports.delete = async (req, res, next) => {
  await permission(req.user, res, true)

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: 'deleted',
      },
      { new: true },
    )
    if (!product) {
      return res.status(httpStatus.NOT_FOUND).send('Product not found!!')
    }
    return res.status(httpStatus.OK).json({ product })
  } catch (error) {
    next(error)
  }
}
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params
    const query = await Product.findByIdAndRemove(id)
    return res.status(httpStatus.OK).json({ query })
  } catch (error) {
    next(error)
  }
}
