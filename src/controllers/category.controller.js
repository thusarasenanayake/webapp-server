const Category = require('../models/category.model')
const httpStatus = require('http-status')
const { query } = require('express')

exports.create = async (req, res, next) => {
  try {
    const categoryData = req.body
    const category = new Category(categoryData)
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
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        image: req.body.image,
      },
      { new: true },
    )
    if (!category) {
      throw Error('Category not found!!')
    }
    return res.status(httpStatus.OK).json({ category })
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
