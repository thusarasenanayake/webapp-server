const express = require('express')
const router = express.Router()
const { validate } = require('express-validation')
const resetPassword = require('../../controllers/resetPassword.controller')
const passwordValidation = require('../../validations/passwordChange.validation')

router.post('/', validate(passwordValidation.change), resetPassword.reset)

module.exports = router
