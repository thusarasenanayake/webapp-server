const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const usersValidation = require('../../validations/users.validation')
const cartController = require('../../controllers/cart.controller')

router.post('/', cartController.update)
router.get('/clear', cartController.clear)
router.post('/delete', cartController.delete)
router.get('/list', cartController.list)
router.post('/update', cartController.updateQuantity)
module.exports = router
