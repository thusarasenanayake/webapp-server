const Category = require('../models/category.model')
const Product = require('../models/product.model')
const Location = require('../models/deliveryArea.model')
const Customer = require('../models/customer.model')
const Staff = require('../models/staff.model')
const httpStatus = require('http-status')

exports.category = async (req, res, next) => {
  try {
      const name = req.body.searchData
      const categories = await Category.find({ categoryName: name })
      .where('status')
      .equals('active')
      .select('categoryName')
    if (!categories) {
      throw Error('Category not found!!')
    }
    return res.status(httpStatus.OK).json({ categories })
  } catch (error) {
    next(error)
  }
}
exports.product = async (req, res, next) => {
  try {
      const name = req.body.searchData
      const products = await Product.find({ productName: name })
      .where('status')
      .equals('active')
      .select('productName inStock price')
    if (!products) {
      throw Error('Product not found!!')
    }
    return res.status(httpStatus.OK).json({ products })
  } catch (error) {
    next(error)
  }
}
exports.location = async (req, res, next) => {
  try {
    const name = req.body.searchData
    const cities = await Location.find({ city: name })
      .where('status')
      .ne('deleted')
      .select('city price status')
    if (!cities) {
      throw Error('Product not found!!')
    }
    return res.status(httpStatus.OK).json({ cities })
  } catch (error) {
    next(error)
  }
}
exports.customer = async (req, res, next) => {
  try {
    const name = req.body.searchData
   const customers = await Customer.find({$or:[{firstName:name},{lastName :name}]})
      .where('status')
      .equals('active')
      .select('firstName lastName email address phoneNumber')
    console.log(customers);
    if (!customers) {
      throw Error('User not found!!')
    }
    return res.status(httpStatus.OK).json({ customers })
  } catch (error) {
    next(error)
  }
}
exports.employee = async (req, res, next) => {
  try {
    const name = req.body.searchData
   const employees = await Staff.find({$or:[{firstName:name},{lastName :name}]})
      .where('status')
      .equals('active')
      .select('firstName lastName userName  isAdmin')
    console.log(employees);
    if (!employees) {
      throw Error('User not found!!')
    }
    return res.status(httpStatus.OK).json({ employees })
  } catch (error) {
    next(error)
  }
}