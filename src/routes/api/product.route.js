const express = require('express')
const router = express.Router()
const multer = require('multer')
const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype]
    let uploadError = new Error('Invalid file type')
    if (isValid) {
      uploadError = null
    }
    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('.')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, fileName + '-' + Date.now() + '.' + extension)
  },
})

const uploadOptions = multer({ storage: storage })
const { validate } = require('express-validation')
const productValidation = require('../../validations/product.validation')
const productController = require('../../controllers/product.controller')

router.post(
  '/',
  uploadOptions.single('image'),
  validate(productValidation.create),
  productController.create,
)
router.get('/list', productController.list)
router.get('/:id', productController.view)
router.put('/:id', productController.updateCIP)
router.put(
  '/gallery-images/:id',
  uploadOptions.array('images'),
  productController.galleryUpdate,
)
router.delete('/:id', productController.remove)
module.exports = router
