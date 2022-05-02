const express = require('express')
const router = express.Router()

const reportsController = require('../../controllers/reports.controller')

router.post('/income', reportsController.income)
router.post('/delivery', reportsController.delivery)
router.post('/product', reportsController.products)
router.post('/customer', reportsController.customer)

module.exports = router
