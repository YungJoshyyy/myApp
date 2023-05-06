const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const {login} = require('../auth/auth');
const {verify} = require('../auth/auth');


router.get('/', controller.homepage);

router.get('/about', controller.aboutpage);

router.get('/register', controller.registerpage);
router.post('/register', controller.post_reg);


router.get('/login', controller.loginpage);
router.post('/login', login, controller.handle_login);

router.get('/logout', verify, controller.logout);

router.get('/goal', verify, controller.cgp);
router.post('/goal', verify, controller.post_goal);
router.get('/account', verify, controller.accountpage);


module.exports = router;