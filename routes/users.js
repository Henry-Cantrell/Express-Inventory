var express = require('express');
var router = express.Router();
var users_controller = require('../controllers/usersController')

// Router res to restful gets 

// Note: login controller logic moved to app.js due to middleware bugs

//router.get("/login", users_controller.user_login_get);
router.get("/signup", users_controller.user_signup_get);
////router.get("/logout", users_controller.user_logout_get)

// Router res to restful posts 

// Note: login controller logic moved to app.js due to middleware bugs

//router.post('/login', users_controller.user_login_post);
router.post('/signup', users_controller.user_signup_post);

module.exports = router;
