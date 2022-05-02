const Product = require('../models/product.model')
const Order = require('../models/order.model')
const OrderItems = require('../models/order-Items.model')
const DeliveryLocations = require('../models/deliveryArea.model')
const Customer = require('../models/customer.model')
const httpStatus = require('http-status')
exports.dashboard = async (req, res, next) => {
const filter = {}
  try {
  
    const orderCount =await Order.count(filter, function (err, count) {    })
    console.log(orderCount);
  } catch (error) {
    next(error)
  }
}
