const express = require('express')
const router = express.Router()

const staffRoute = require('./staff.route')
const customerRoute = require('./customer.route')
const categoryRoute = require('./category.route')
const productRoute = require('./product.route')
const orderRoute = require('./order.route')
const cartRoute = require('./cart.route')
const authTokenRoute = require('./authToken.route')

router.use('/authToken', authTokenRoute)
router.use('/staff', staffRoute)
router.use('/customer', customerRoute)
router.use('/category', categoryRoute)
router.use('/product', productRoute)
router.use('/order', orderRoute)
router.use('/cart', cartRoute)
module.exports = router
