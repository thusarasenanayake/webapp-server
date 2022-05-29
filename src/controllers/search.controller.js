const Category = require('../models/category.model')
const Product = require('../models/product.model')
const Location = require('../models/deliveryArea.model')
const Customer = require('../models/customer.model')
const Staff = require('../models/staff.model')
const Order = require('../models/order.model')
const httpStatus = require('http-status')

exports.category = async (req, res, next) => {
  try {
    let filter = {}
    const name = req.body.searchData
    if (name !== undefined && name !== null) {
      filter.categoryName = {
        $regex: '.*' + name + '.*',
        $options: 'i',
      }
    }
    console.log(filter)
    const categories = await Category.find(filter)
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
    console.log(req.body)
    let filter = {}
    const name = req.body.searchData
    const category = req.body.category
    if (name !== undefined && name !== null) {
      filter.productName = {
        $regex: '.*' + name + '.*',
        $options: 'i',
      }
    }
    if (category !== undefined && category !== null && category !== 'all') {
      filter.category_id = category
    }
    const products = await Product.find(filter)
      .where('status')
      .equals('active')
      .select('productName inStock price')
    console.log('hi', products)
    if (products.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send('not found')
    }
    return res.status(httpStatus.OK).json({ products })
  } catch (error) {
    next(error)
  }
}
exports.location = async (req, res, next) => {
  try {
    let filter = {}
    const name = req.body.searchData
    if (name !== undefined && name !== null) {
      filter.city = {
        $regex: '.*' + name + '.*',
        $options: 'i',
      }
    }
    const cities = await Location.find(filter)
      .where('status')
      .ne('deleted')
      .select('city price status')
    console.log(cities)
    if (cities.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send('not found')
    }
    return res.status(httpStatus.OK).json({ cities })
  } catch (error) {
    next(error)
  }
}
exports.customer = async (req, res, next) => {
  try {
    let filter = { status: 'active' }
    const name = req.body.searchData
    if (name !== undefined && name !== null) {
      filter.firstName = {
        $regex: '.*' + name + '.*',
        $options: 'i',
      }
      filter.lastName = {
        $regex: '.*' + name + '.*',
        $options: 'i',
      }
    }
    const customers = await Customer.find({
      $or: [{ firstName: filter.firstName }, { lastName: filter.lastName }],
    }).select('cusNumber firstName lastName email address phoneNumber')
    if (customers.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send('No data found')
    }
    return res.status(httpStatus.OK).json({ customers })
  } catch (error) {
    next(error)
  }
}
exports.employee = async (req, res, next) => {
  try {
    let filter = { status: 'active', isAdmin: 'false' }
    const name = req.body.searchData
    if (name !== undefined && name !== null) {
      filter.firstName = {
        $regex: '.*' + name + '.*',
        $options: 'i',
      }
      filter.lastName = {
        $regex: '.*' + name + '.*',
        $options: 'i',
      }
    }
    const employees = await Staff.find({
      $or: [{ firstName: filter.firstName }, { lastName: filter.lastName }],
      $and: [{ status: filter.status }, { isAdmin: filter.isAdmin }],
    })
      .where('status')
      .equals('active')
      .select('usrName firstName lastName userName  isAdmin')
    if (!employees) {
      throw Error('User not found!!')
    }
    return res.status(httpStatus.OK).json({ employees })
  } catch (error) {
    next(error)
  }
}
exports.order = async (req, res, next) => {
  const date = req.body
  console.log(date)
  try {
    let startDateNew = new Date(req.body.startDate)
    startDateNew.setHours(startDateNew.getHours() + 5)
    startDateNew.setMinutes(startDateNew.getMinutes() + 30)

    let endDateNew = new Date(req.body.endDate)
    endDateNew.setDate(endDateNew.getDate() + 1)
    endDateNew.setHours(endDateNew.getHours() + 5)
    endDateNew.setMinutes(endDateNew.getMinutes() + 29)
    endDateNew.setSeconds(59)
    endDateNew.setMilliseconds(999)
    let filter = { isActive: 'true' }

    if (req.body.searchData !== undefined && req.body.searchData !== null) {
      filter.receiverName = {
        $regex: '.*' + req.body.searchData + '.*',
        $options: 'i',
      }
    }

    if (req.body.startDate !== undefined && req.body.endDate !== null) {
      filter.dateOrder = { $gte: startDateNew, $lte: endDateNew }
    }
    console.log(filter)
    //const orderList = await Order.find({ dateOrder: { $gte: startDateNew, $lte: endDateNew }, receiverName: req.body.name })
    const orderList = await Order.find(filter).sort({ dateOrder: -1 })
    console.log(orderList.length)
    if (orderList.length === 0)
      return res.status(httpStatus.NOT_FOUND).send('No data found')
    return res.status(httpStatus.OK).json({ orderList })
  } catch (error) {
    next(error)
  }
}
