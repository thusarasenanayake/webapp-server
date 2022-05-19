const express = require('express')
const router = express.Router()

const reportsController = require('../../controllers/reports.controller')

router.post('/income', reportsController.income)
router.post('/productIncome', reportsController.productIncome)
router.post('/delivery', reportsController.delivery)
router.post('/product', reportsController.popularProducts)
router.post('/customer', reportsController.customer)

module.exports = router
