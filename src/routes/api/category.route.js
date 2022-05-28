const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const categoryValidation = require('../../validations/category.validation')
const categoryController = require('../../controllers/category.controller')

router.post('/', validate(categoryValidation.create), categoryController.create)
router.get('/list', categoryController.list)
router.get('/listFe', categoryController.listForFrontEnd)
router.get('/:id', categoryController.view)
router.put(
  '/:id',
  validate(categoryValidation.update),
  categoryController.update,
)
router.put('/delete/:id', categoryController.delete)
router.delete('/:id', categoryController.remove)

module.exports = router
