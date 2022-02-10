const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const usersValidation = require('../../validations/users.validation')
const orderController = require('../../controllers/order.controller')

// create new user
router.post('/:id', orderController.create)

// update order status
router.put('/:id', orderController.update)

//  get all orders data
router.get('/list', orderController.list)

// get a single user order info
router.get('/myorders/:userid', orderController.viewuserorder)
router.get('/myorder/:id', orderController.viewAOrder)
//get total order count
router.get('/count', orderController.count)

// delete
router.put('/delete/:id', orderController.delete)
module.exports = router
