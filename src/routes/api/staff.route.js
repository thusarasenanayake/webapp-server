const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const staffValidation = require('../../validations/staff.validation')
const staffController = require('../../controllers/staff.controller')

router.post('/login', validate(staffValidation.login), staffController.login)
router.put('/reset', validate(staffValidation.reset), staffController.reset)
router.post('/', validate(staffValidation.create), staffController.create)
router.get('/listEmployee', staffController.listEmployee)
router.get('/profile', staffController.profile)
router.get('/:id', staffController.view)
router.put('/:id', validate(staffValidation.update), staffController.update)
router.get('/delete/:id', staffController.delete)
router.delete('/:id', staffController.remove)
router.get('/listAdmin', staffController.listAdmin)

module.exports = router
