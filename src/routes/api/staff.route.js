const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const staffValidation = require('../../validations/staff.validation')
const staffController = require('../../controllers/staff.controller')

router.get('/delete/:id', staffController.delete)
router.get('/listAdmin', staffController.listAdmin)
router.get('/listEmployee', staffController.listEmployee)
router.post('/login', validate(staffValidation.login), staffController.login)
router.get('/profile', staffController.profile)
router.put('/reset', validate(staffValidation.reset), staffController.reset)
router.post('/resetPassword', staffController.resetPassword)
router.get('/:id', staffController.view)
router.post('/promotion', staffController.Promotion)
router.put('/:id', validate(staffValidation.update), staffController.update)
router.delete('/:id', staffController.remove)
router.post('/', validate(staffValidation.create), staffController.create)

module.exports = router
