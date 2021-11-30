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
const categoryValidation = require('../../validations/category.validation')
const categoryController = require('../../controllers/category.controller')

// create new category
router.post(
  '/',
  uploadOptions.single('image'),
  validate(categoryValidation.create),
  categoryController.create,
)
//  get all category data
router.get('/list', categoryController.list)
// get a category data
router.get('/:id', categoryController.view)
//update
router.put('/:id', uploadOptions.single('image'), categoryController.update)
//category delete
router.delete('/:id', categoryController.remove)
module.exports = router
