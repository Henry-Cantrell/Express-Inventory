var express = require('express');
var router = express.Router();
var users_controller = require('../controllers/usersController')

// Note: login controller logic moved to app.js due to middleware bugs

//router.get("/login", users_controller.user_login_get);

////router.get("/logout", users_controller.user_logout_get)

// Note: login controller logic moved to app.js due to middleware bugs

//router.post('/login', users_controller.user_login_post);

// Signup restful methods

router.get("/signup", users_controller.user_signup_get);
router.post('/signup', users_controller.user_signup_post);

// Listings restful methods

router.get("/listings", users_controller.user_listings_get);


module.exports = router;
