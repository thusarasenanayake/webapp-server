const Product = require('../models/product.model')
const Order = require('../models/order.model')
const OrderItems = require('../models/order-Items.model')
const Category = require('../models/category.model')
const DeliveryLocations = require('../models/deliveryArea.model')
const Customer = require('../models/customer.model')
const httpStatus = require('http-status')
exports.dashboard = async (req, res, next) => {
  const filter = {}
  let data={}
  const date = new Date().toDateString()
  const tomorrow =new Date(new Date(date).getTime() + 60 * 60 * 24 * 1000);
  console.log(date,date+1);
  try {
    const todayOrderCount = await Order.find({dateOrder: { $gte: date, $lte: tomorrow },status:'processing'}).count()
    const totalOrderCount = await Order.find(filter).count()
    const newCustomer =await Customer.find({ dateRegistered: { $gte: date, $lte: tomorrow } }).count()
    const totalCustomer =await Customer.find(filter).count()
    const totalProducts = await Product.count()
    const totalCategories =await Category.count()
    const allTodayOrders = await Order.find({ dateOrder: { $gte: date, $lte: tomorrow } })
    let totalIncome =0
    console.log(allTodayOrders[1].totalPrice);
    for (let i = 0; i < allTodayOrders.length; i++){
      totalIncome+=allTodayOrders[i].totalPrice
    }
    data ={totalOrderCount:totalOrderCount, totalCategories:totalCategories,newCustomer:newCustomer,todayOrderCount: todayOrderCount, totalIncome: totalIncome, totalProducts: totalProducts, totalCustomer: totalCustomer }
    if (data) 
      return res.status(httpStatus.OK)
        .json({ data})
    return res.status(httpStatus.NOT_FOUND).send('No data found')
    
  } catch (error) {
    next(error)
  }
}
