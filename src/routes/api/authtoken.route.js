const express = require('express')
const router = express.Router()

const authTokenController = require('../../controllers/authToken.controller')

router.get('/', authTokenController.confirm)
module.exports = router
