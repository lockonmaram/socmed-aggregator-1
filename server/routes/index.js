const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController')


/* GET home page. */
router.get('/', function(req, res) {
  res.send('home')
});
router.post('/signup', usersController.registerUser)
router.post('/login', usersController.login)
router.post('/fblogin', usersController.fbLogin)

module.exports = router;
