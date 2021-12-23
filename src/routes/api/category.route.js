const express = require('express')
const router = express.Router()

const { validate } = require('express-validation')
const categoryValidation = require('../../validations/category.validation')
const categoryController = require('../../controllers/category.controller')

// create new category
router.post('/', validate(categoryValidation.create), categoryController.create)
//  get all category data
router.get('/list', categoryController.list)
// get a category data
router.get('/:id', categoryController.view)
//update
router.put('/:id', categoryController.update)
//category delete
router.delete('/:id', categoryController.remove)
module.exports = router
