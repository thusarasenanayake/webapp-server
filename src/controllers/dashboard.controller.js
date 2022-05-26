const Product = require('../models/product.model')
const Order = require('../models/order.model')
const OrderItems = require('../models/order-Items.model')
const Category = require('../models/category.model')
const Customer = require('../models/customer.model')
const httpStatus = require('http-status')
exports.dashboard = async (req, res, next) => {
  const filter = {}
  let data = {}
  var tomorrow = new Date(new Date().setUTCHours(47, 59, 59, 999))
  var date = new Date(new Date().setUTCHours(24, 0, 0, 0))
  console.log(date, tomorrow)
  try {
    const todayOrderCount = await Order.find({
      dateOrder: { $gte: date, $lte: tomorrow },
      status: 'pending',
    }).count()
    const totalOrderCount = await Order.find(filter)
      .count()
      .where('isActive')
      .equals('true')
    const newCustomer = await Customer.find({
      dateRegistered: { $gte: date, $lte: tomorrow },
    }).count()
    const totalCustomer = await Customer.find(filter).count()
    const totalProducts = await Product.count({ status: 'active' })
    const totalCategories = await Category.count()
    const allTodayOrders = await Order.find({
      dateOrder: { $gte: date, $lte: tomorrow },
    })
      .where('status')
      .equals('delivered')
    let totalIncome = 0
    for (let i = 0; i < allTodayOrders.length; i++) {
      totalIncome += allTodayOrders[i].totalPrice
    }
    data = {
      totalOrderCount: totalOrderCount,
      totalCategories: totalCategories,
      newCustomer: newCustomer,
      todayOrderCount: todayOrderCount,
      totalIncome: totalIncome,
      totalProducts: totalProducts,
      totalCustomer: totalCustomer,
    }
    console.log(totalIncome)
    if (data) return res.status(httpStatus.OK).json({ data })
    return res.status(httpStatus.NOT_FOUND).send('No data found')
  } catch (error) {
    next(error)
  }
}
