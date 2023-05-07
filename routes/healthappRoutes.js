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
//Sets Goal to completed
router.post('/updateGoal', verify, controller.completeGoal);
//Removes goal from achievment list
router.post('/updateGoalRC', verify, controller.removeGoalRC);

router.post('/updateprofile', verify, controller.updateProfile);

router.get('/goal', verify, controller.cgp);
router.post('/goal', verify, controller.post_goal);
router.get('/account', verify, controller.accountpage);

router.use(function(req, res) {
    res.status(404);
    //res.render('404');
});

router.use(function(err, req, res, next) {

    res.status(500);
    //res.render('500');
});

module.exports = router;