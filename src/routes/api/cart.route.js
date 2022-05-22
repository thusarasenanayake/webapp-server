const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const cartController = require('../../controllers/cart.controller')
const cartValidation = require('../../validations/cart.Validation')

router.post('/', validate(cartValidation.add), cartController.add)
router.get('/clear', cartController.clear)
router.post('/delete', cartController.delete)
router.get('/list', cartController.list)
router.post('/update', cartController.update)
module.exports = router
