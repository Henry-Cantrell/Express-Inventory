var GearCartItem = require('../models/gear_cart_item');
var async = require('async');
const { body,validationResult } = require("express-validator");
var User = require("../models/user");

// Display list of all gearCartItem.
exports.gearCartItem_list = function(req, res, next) {

  GearCartItem.find()
    .exec(function (err, gearCartItem_list) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('gearCartItem_list', { title: 'Gear Cart Items: ', gearCartItem_list: gearCartItem_list });
    });
};

// Handle gearCartItem create on POST.

exports.gearCartItem_create_post =  [

  // Validate and sanitize the name field.
  body('user', 'user required').trim().isLength({ min: 1 }).escape(),
  body('gear', 'gear required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a gearCartItem object with escaped and trimmed data.
    var gearCartItem= new GearCartItem(
      { gear: req.body.gear,
        user: req.body.user
      }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.redirect('/inventory/gear/' + req.body.gear._id);
      return;
    }
    else {
      // Save and push gear cart item into user array
          gearCartItem.save(function (err) {
            if (err) { 
              return next(err); 
            } else {
            res.redirect('/');
            }
          })
      
    }
  }
];
