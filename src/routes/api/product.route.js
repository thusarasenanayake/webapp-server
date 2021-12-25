const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const productValidation = require('../../validations/product.validation')
const productController = require('../../controllers/product.controller')

router.post('/', productController.create)
router.get('/list', productController.list)
router.get('/:id', productController.view)
router.put('/:id', productController.update)
// router.put(
//   '/gallery-images/:id',
//   productController.galleryUpdate,
// )
router.put('/delete/:id', productController.delete)
module.exports = router
