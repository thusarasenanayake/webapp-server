const Product = require('../models/product.model')
const Category = require('../models/category.model')
const httpStatus = require('http-status')

exports.create = async (req, res, next) => {
  console.log(req.body)
  try {
    const categoryID = req.body.category_id
    const category = await Category.findById(categoryID)
    if (!category) {
      console.log(category, req.body.productName)
      return res.status(httpStatus.BAD_REQUEST).json('Invalid Category')
    } else {
      const productData = new Product({
        productName: req.body.productName,
        //   description: req.body.description,
        //   image: req.body.image,
        price: req.body.price,
        category_id: req.body.category_id,
        inStock: req.body.inStock,
        // rating: req.body.rating,
        // dateCreated: req.body.dateCreated,
      })
      console.log(productData)
      await productData.save()
      return res.status(httpStatus.CREATED).json({ productData })
    }
  } catch (error) {
    next(error)
  }
}

// exports.galleryUpdate = async (req, res, next) => {
//   const files = req.files
//   console.log(req.files)
//   const protocol = req.protocol
//   const host = req.get('host')
//   const basePath = protocol + '://' + host + '/public/uploads/'
//   let imagesPaths = []
//   if (files) {
//     files.map((file) => {
//       imagesPaths.push(basePath + file.filename)
//     })
//   }
//   try {
//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       {
//         images: req.body.images,
//       },
//       { new: true },
//     )
//     if (!product) {
//       return res.status(httpStatus.NOT_FOUND).send('Product not found!!')
//     }
//     return res.status(httpStatus.OK).json({ product })
//   } catch (error) {
//     next(error)
//   }
// }

exports.view = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
      .select('-__v')
      .populate({ path: 'category_id', model: Category })
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
      .select('-__v')
      .populate({ path: 'category_id', model: Category })
    const products = await query.exec()
    return res.status(httpStatus.OK).json({ products })
  } catch (error) {
    next(error)
  }
}

//update countStocks, instock status and price
exports.update = async (req, res, next) => {
  try {
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
  console.log(req.params.id, 'hi')
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
