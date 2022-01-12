const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const usersValidation = require('../../validations/users.validation')
const cartController = require('../../controllers/cart.controller')

// create new user
//router.post('/', cartController.create)

// update order status
router.post('/', cartController.update)

// //  get all orders data
router.post('/list', cartController.list)

// // get a single user order info
// router.get('/myorder/:userid', cartController.viewuserorder)

// //get total order count
// router.get('/count', cartController.count)

// // delete
// router.delete('/', cartController.delete)
module.exports = router
