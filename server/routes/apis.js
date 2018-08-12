var express = require('express');
var router = express.Router();
var ApiController = require('../controllers/apiController')
const Authorization = require('../middlewares/authorization')
const Authentication = require('../middlewares/authentication')

/* GET users listing. */
router.get('/user', Authentication.authenticationRead, ApiController.getUser);
router.post('/search', Authentication.authenticationRead, ApiController.search);
router.post('/repo', Authentication.authenticationRead, ApiController.createRepo);

module.exports = router;
