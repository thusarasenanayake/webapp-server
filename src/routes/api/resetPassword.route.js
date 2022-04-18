const express = require('express')
const router = express.Router()
const resetPassword = require('../../controllers/resetPassword.controller')

router.post('/', resetPassword.reset)

module.exports = router