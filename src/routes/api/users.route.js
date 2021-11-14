const express = require('express');
const router = express.Router();

const {validate} = require('express-validation')
const usersValidation = require('../../validations/users.validation');
const usersController = require("../../controllers/users.controller");


// create new user
router.post('/',usersController.create);
//  get all users data
router.get('/list',usersController.list);
//login
router.post('/login',usersController.login);
// get a user data
router.get('/:id',usersController.view);
//update user data
router.put('/:id',usersController.update);
//temp delete
router.put('/delete/:id',usersController.delete);
//permernent delete
router.delete('/:id',usersController.remove);
module.exports = router;