const Category = require('../models/category.model')
const httpStatus = require('http-status')

exports.create = async (req, res, next) => {
  console.log('category creating')
  const filter = { categoryName: req.body.categoryName }
  try {
    //check Existence categories
    const checkExistence = await Category.find(filter)
      .where('status')
      .equals('active')
      .select('categoryName')
    if (checkExistence.length !== 0) {
      return res.status(httpStatus.CONFLICT).send('Category exist')
    }

    //save new category
    const category = new Category({
      categoryName: req.body.categoryName,
      image: req.body.image,
    })
    const newCategory = await category.save()

    if (newCategory) {
      return res.status(httpStatus.CREATED).json({ category })
    } else {
      return res.status(httpStatus.BAD_REQUEST).send('cannot create')
    }
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
    const categories = await Category.find({})
      .where('status')
      .equals('active')
      .select('-__v')
    if (categories.length !== 0) {
      return res.status(httpStatus.OK).json({ categories })
    } else {
      return res.status(httpStatus.NOT_FOUND).send('No categories found')
    }
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      console.log(category)
      return res.status(httpStatus.NOT_FOUND).send('category not found')
    }
    const checkCategory = await Category.findOne({
      categoryName: req.body.categoryName,
    })
    if (checkCategory) {
      if (checkCategory._id.toString() !== req.params.id) {
        return res.status(httpStatus.CONFLICT).send('exist')
      }
    }
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
