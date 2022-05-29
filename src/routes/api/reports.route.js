const express = require('express')
const router = express.Router()

const reportsController = require('../../controllers/reports.controller')

router.post('/customer', reportsController.customerLoyalty)
router.post('/delivery', reportsController.locationReport)
router.post('/income', reportsController.totalIncome)
router.post('/productIncome', reportsController.productIncome)
router.post('/product', reportsController.popularProducts)
router.post('/productbylocation', reportsController.productByLocation)
router.get('/products', reportsController.customersFavProducts) //not used
router.post('/product/sold/:id', reportsController.ProductsWiseCustomers) //product page
router.get('/:id', reportsController.order)

module.exports = router
