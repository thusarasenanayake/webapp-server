const express = require('express')
const router = express.Router()

const searchController = require('../../controllers/search.controller')

router.post('/category', searchController.category)
router.post('/product', searchController.product)
router.post('/delivery', searchController.location)
router.post('/customer', searchController.customer)
router.post('/employee', searchController.employee)

module.exports = router
