const express = require('express')
const router = express.Router()
const { validate } = require('express-validation')
const deliveryLocationValidation = require('../../validations/deliveryLocation.validation')
const deliveryAreaController = require('../../controllers/deliveryArea.controller')

router.get('/location', deliveryAreaController.location)
router.put(
  '/delete/:id',
  validate(deliveryLocationValidation.delete),
  deliveryAreaController.delete,
)
router.get('/:id', deliveryAreaController.view)
router.put(
  '/:id',
  validate(deliveryLocationValidation.update),
  deliveryAreaController.update,
)
router.get('/', deliveryAreaController.list)

router.post(
  '/',
  validate(deliveryLocationValidation.create),
  deliveryAreaController.create,
)
module.exports = router
