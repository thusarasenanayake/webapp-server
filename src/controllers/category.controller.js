const Category = require('../models/category.model')
const httpStatus = require('http-status')
const { query } = require('express')

exports.create = async (req, res, next) => {
  const fileName = req.file.filename
  const protocol = req.protocol
  const host = req.get('host')
  //const basePath= '${req.protocol}://${req.get('host')}/public/uploads/'
  const basePath = protocol + '://' + host + '/public/uploads/'
  try {
    const category = new Category({
      categoryName: req.body.categoryName,
      image: basePath + fileName,
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
    const category = await Category.findById(id).select('-__v')
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
    const query = Category.find({}).select('-__v')
    const categories = await query.exec()
    return res.status(httpStatus.OK).json({ categories })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  const category = await Category.findById(req.params.id)
  const file = req.file
  const protocol = req.protocol
  const host = req.get('host')
  const basePath = protocol + '://' + host + '/public/uploads/'
  let imagePath

  if (file) {
    fileName = req.file.filename
    imagePath = basePath + fileName
  } else {
    imagePath = category.image
  }
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        categoryName: req.body.categoryName,
        image: imagePath,
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

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params
    const query = await Category.findByIdAndRemove(id)
    return res.status(httpStatus.OK).json({ query })
  } catch (error) {
    next(error)
  }
}
