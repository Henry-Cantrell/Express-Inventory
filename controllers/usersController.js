// Passport deps

const bcrypt = require('bcryptjs');

// Node and Express deps

var async = require('async');
const { body,validationResult } = require("express-validator");
const User = require('../models/user'); 

  // for each item in motorcycle and gear array
  // push into motorcycle and gear array within cart

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

// Listings get method

//lookup motorcycle and gear items with user ID
//give to page for render

exports.user_listings_get = function(req, res, next) {

  //Retrieve all motorcycles and gears
  
  async.parallel({
    motorcycles: function(callback) {
        Motorcycle.where;
    },
    gears: function(callback) {
        Gear.where();
    },
  }, function(err, results) {
    if (err) { return next(err); }
    res.render('user_listings', { motorcycles: results.motorcycles, gears: results.gears });
  });
  };

  exports.user_listings_get = function(req, res, next) {

    // Get gear, manufacturers and types for form.
    async.parallel({
        gear: function(callback) {
            Gear.find().where('listing_creator' == req.body.id)
        },
        motorcycles: function(callback) {
            Motorcycle.find().where('listing_creator' == req.body.id);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.gear==null || results.motorcycles == null) { // No results.
                var err = new Error('Not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            
            res.render('guser_listings', { title: 'Update gear', motorcycles: results.motorcycles, gears: results.gears });
        });

};

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
        password: hashedPassword,
      }).save(err => {
        if (err) { 
          return next(err);
        }
        res.redirect("/users/login");
      });
    }
  })

  };
  
