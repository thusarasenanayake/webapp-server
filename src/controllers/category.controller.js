const Category = require('../models/category.model')
const httpStatus = require('http-status')

exports.create = async (req, res, next) => {
  console.log(req.body, 'hello')
  try {
    const category = new Category({
      categoryName: req.body.categoryName,
      image: req.body.image,
    })
    await category.save()
    return res.status(httpStatus.CREATED).json({ category })
  } catch (error) {
    next(error)
  }
}

exports.view = async (req, res, next) => {
  try {
    const { id } = req.params
    const category = await Category.findById(id)
      .where('status')
      .equals('active')
      .select('-__v')
    if (!category) {
      throw Error('Category not found!!')
    }
    return res.status(httpStatus.OK).json({ category })
  } catch (error) {
    next(error)
  }
}

exports.list = async (req, res, next) => {
  try {
    const query = Category.find({})
      .where('status')
      .equals('active')
      .select('-__v')
    const categories = await query.exec()
    return res.status(httpStatus.OK).json({ categories })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  const category = await Category.findById(req.params.id)
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        categoryName: req.body.categoryName,
        image: req.body.image,
      },
      { new: true },
    )
    if (!updatedCategory) {
      throw Error('Category not found!!')
    }
    return res.status(httpStatus.OK).json({ updatedCategory })
  } catch (error) {
    next(error)
  }
}
exports.delete = async (req, res, next) => {
  const category = await Category.findById(req.params.id)
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { status: 'deleted' },
      { new: true },
    )
    if (!updatedCategory) {
      throw Error('Category not found!!')
    }
    return res.status(httpStatus.OK).json({ updatedCategory })
  } catch (error) {
    next(error)
  }
}
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params
    const query = await Category.findByIdAndRemove(id)
    return res.status(httpStatus.OK).json({ query })
  } catch (error) {
    next(error)
  }
}
