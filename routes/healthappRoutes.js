const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.get('/', controller.homepage);

router.get('/login', controller.loginpage);

//need to add in verify
 router.get('/account', controller.accountpage);

router.get('/register', controller.registerpage);

module.exports = router;