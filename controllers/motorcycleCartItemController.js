var MotorcycleCartItem = require('../models/motorcycle_cart_item');
var async = require('async');
const { body,validationResult } = require("express-validator");
var User = require('../models/user');
const motorcycle_cart_item = require('../models/motorcycle_cart_item');

// Display list of all motorcycleCartItem.
exports.motorcycleCartItem_list = function(req, res, next) {

  MotorcycleCartItem.find()
    .exec(function (err, motorcycleCartItem_list) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('motorcycleCartItem_list', { title: 'Types of Motorcycle Gear', motorcycleCartItem_list: motorcycleCartItem_list });
    });
};

// Handle motorcycleCartItem create on POST.
exports.motorcycleCartItem_create_post =  [

  // Validate and sanitize the name field.
  body('user', 'user required').trim().isLength({ min: 1 }).escape(),
  body('motorcycle', 'user required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a motorcycleCartItem object with escaped and trimmed data.
    var motorcycleCartItem= new MotorcycleCartItem(
      { motorcycle: req.body.motorcycle,
        user: req.body.user
      }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.redirect('');
      return;
    }
    else {
      // Save item, then push item into user array
          async.parallel({

            function () {
              motorcycleCartItem.save(function (err) {
              if (err) { 
                return next(err); 
              } else {
              // motorcycleCartItem saved. Redirect to home page.
              next();
              }
            })
          }, function () {
            User.findOneAndUpdate(
             {_id: req.body.user._id},
             { $push: {motorcycle_cart_items: motorcycleCartItem} },
             function (err) {
               if (err) {
                 console.log(err)
               } else {
                 res.redirect('/')
               }
             }
            )
              
            
          }

          })
             
    }
  }
];
