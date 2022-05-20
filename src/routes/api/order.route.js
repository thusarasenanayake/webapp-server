const express = require('express')
const router = express.Router()
const { validate } = require('express-validation')
const orderValidation = require('../../validations/orders.validation')
const orderController = require('../../controllers/order.controller')

router.post('/', validate(orderValidation.create), orderController.create)
router.put('/:id', validate(orderValidation.update), orderController.update)
router.get('/list', orderController.allOrders)
router.get('/myorders', orderController.viewuserorder)
router.get('/myorder/:id', orderController.viewAOwnOrder)
router.get('/view/:id', orderController.viewOrder)
router.get('/count', orderController.count)
router.put('/delete/:id', orderController.delete)
//not called
router.delete('/:id', orderController.remove)
router.get('/list/:status', orderController.orderListByStatus)
module.exports = router
