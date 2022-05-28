const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const searchValidation = require('../../validations/search.validation')
const searchController = require('../../controllers/search.controller')

router.post(
  '/category',
  validate(searchValidation.search),
  searchController.category,
)
router.post(
  '/product',
  // validate(searchValidation.search),
  searchController.product,
)
router.post(
  '/delivery',
  validate(searchValidation.search),
  searchController.location,
)
router.post(
  '/customer',
  validate(searchValidation.search),
  searchController.customer,
)
router.post(
  '/employee',
  validate(searchValidation.search),
  searchController.employee,
)
router.post('/order', searchController.order)

module.exports = router
