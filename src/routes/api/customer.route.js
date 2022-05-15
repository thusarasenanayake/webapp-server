const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const customerController = require('../../controllers/customer.controller')

router.post('/', customerController.create)
router.get('/list', customerController.list)
router.get('/:id', customerController.view)
router.get('/', customerController.self)
router.put('/', customerController.update)
router.put('/reset', customerController.reset)
router.post('/login', customerController.login)
router.get('/', customerController.view)
router.put('/delete/:id', customerController.delete)
module.exports = router
