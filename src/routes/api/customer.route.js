const express = require('express')
const router = express.Router()
const { validate } = require('express-validation')
const customerValidation = require('../../validations/customer.validation')
const customerController = require('../../controllers/customer.controller')

router.post('/', validate(customerValidation.create), customerController.create)
router.put('/', validate(customerValidation.update), customerController.update)
router.put(
  '/reset',
  validate(customerValidation.reset),
  customerController.reset,
)
router.post(
  '/login',
  validate(customerValidation.login),
  customerController.login,
)
router.put(
  '/delete/:id',
  validate(customerValidation.delete),
  customerController.delete,
)
router.get('/list', customerController.list)
router.post('/:id', customerController.promotion)
router.get('/:id', customerController.view)
router.get('/', customerController.self)

module.exports = router
