const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const staffValidation = require('../../validations/staff.validation')
const staffController = require('../../controllers/staff.controller')

// create new user
router.post('/', validate(staffValidation.create),staffController.create)
//  get all users data
router.get('/listEmployee', staffController.listEmployee)
//  get all admin data
router.get('/listAdmin', staffController.listAdmin)
//login
router.post('/login', staffController.login)
// get a user data
router.get('/:id', staffController.view)
//update user data
router.put('/:id', staffController.update)
router.put('/reset/:id', staffController.reset)

//temp delete
router.put('/delete/:id', staffController.delete)
//permernent delete
router.delete('/:id', staffController.remove)
module.exports = router
