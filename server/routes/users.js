var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController')
const Authorization = require('../middlewares/authorization')
const Authentication = require('../middlewares/authentication')

/* GET users listing. */
router.get('/', Authorization.authorizationAdmin, usersController.getUsers);
router.get('/:id', Authentication.authenticationRead, Authorization.authorizationUserAdmin, usersController.getOneUser);
router.post('/', Authorization.authorizationAdmin, usersController.registerUser);
router.delete('/:id', Authentication.authenticationRead, Authorization.authorizationAdmin, usersController.deleteUser);
router.put('/:id', Authorization.authorizationUserAdmin, usersController.updateUser);

// router.delete('/:id', Authentication.authenticationRead, Authorization.authorizationAdmin, usersController.deleteUser);
module.exports = router;
