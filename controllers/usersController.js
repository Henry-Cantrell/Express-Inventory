// Passport deps
const bcrypt = require('bcryptjs');
//const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Node and Express deps

var async = require('async');
const { body,validationResult } = require("express-validator");
const User = require('../models/user'); 
const Cart = require('../models/cart');

// Cart get method

exports.user_cart_get = function (req, res) {
     res.render("cart_show")
};

// Login get method
// Note: login controller logic moved to app.js due to middleware bugs

//exports.user_login_get = function (req, res) { 
//    res.render("login_form")
//};

// Logout get method
// Note: logout controller logic moved to app.js due to middleware bugs

//exports.user_logout_get = function (req, res) {
//  req.logout();
//  res.redirect('/');
//};

// Login post method
// Note: login controller moved to app.js due to middleware bugs

//exports.user_login_post = function (req, res, next){(
//  passport.authenticate("local", {
//    successRedirect: "/",
//    failureRedirect: "/login",
//  })
//)};

// Signup get method

exports.user_signup_get = function (req, res) { 
  res.render("signup_form")
};

// Signup post method

exports.user_signup_post = function (req, res, next){ 

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      else {
        const user = new User({
          username: req.body.username,
          password: hashedPassword
        }).save(err => {
          if (err) { 
            return next(err);
          }
          res.redirect("/users/login");
        });
      }
    });
  };
  
