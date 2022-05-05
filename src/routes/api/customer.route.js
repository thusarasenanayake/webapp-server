const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const customerController = require('../../controllers/customer.controller')

// create new user
router.post('/', customerController.create)
//  get all users data
router.get('/list', customerController.list)
router.get('/:id', customerController.view)
router.get('/', customerController.self)


//update
router.put('/:id', customerController.update)
//login
router.post('/login', customerController.login)
// get a user data
router.get('/', customerController.view)
//cdelete
router.put('/delete/:id', customerController.delete)
// router.put('/:id', customerController.delete)
module.exports = router
