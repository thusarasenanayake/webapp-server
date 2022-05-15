const express = require('express')
const router = express.Router()
const deliveryAreaController = require('../../controllers/deliveryArea.controller')

router.post('/', deliveryAreaController.create)
router.put('/:id', deliveryAreaController.update)
router.get('/', deliveryAreaController.list)
router.get('/location', deliveryAreaController.location)
router.get('/:id', deliveryAreaController.view)
router.put('/delete/:id', deliveryAreaController.delete)

module.exports = router
