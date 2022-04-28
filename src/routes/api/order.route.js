const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const usersValidation = require('../../validations/users.validation')
const orderController = require('../../controllers/order.controller')

router.post('/', orderController.create)
router.post('/search', orderController.search)

// update order status
router.put('/:id', orderController.update)

//  get all orders data
router.get('/list', orderController.allOrders)
router.post('/report', orderController.report)

router.get('/list/:status', orderController.orderListByStatus)

// get a single user order info
router.get('/myorders', orderController.viewuserorder)
router.get('/myorder/:id', orderController.viewAOwnOrder)

router.get('/view/:id', orderController.viewOrder)

//get total order count
router.get('/count', orderController.count)

// delete
router.put('/delete/:id', orderController.delete)
module.exports = router
