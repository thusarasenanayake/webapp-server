const express = require('express');
const router = express.Router();

const {validate} = require('express-validation')
const usersValidation = require('../../validations/users.validation');
const customerController = require("../../controllers/customer.controller");


// create new user
router.post('/',customerController.create);
//  get all users data
router.get('/list',customerController.list);
//login
router.post('/login',customerController.login);
// get a user data
router.get('/:id',customerController.view);
//cdelete
router.delete('/:id',customerController.remove);
module.exports = router;