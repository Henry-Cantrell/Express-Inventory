var GearCartItem = require('../models/gear_cart_item');
var MotorcycleCartItem = require('../models/motorcycle_cart_item');
var User = require('../models/user');
var async = require('async');
const { body,validationResult } = require("express-validator");

// Display cart items on get

exports.cart_show = function (req, res, next) {

      async.parallel({

      user: function(callback) {
            
        User.findById(req.params.id)
          .exec(callback);
    },
      user_motorcycle_cart_items : function(callback) {
          MotorcycleCartItem.find({'user' : req.params.id})
          .populate('motorcycle')
          .exec(callback);
      },
      user_gear_cart_items: function(callback){
          GearCartItem.find({'user': req.params.id})
          .populate('gear')
          .exec(callback);
      }
    }, function(err, results) {
        if (err) { 
            return next(err); 
        }
        else if (results.user==null) { // No results.
            var err = new Error('user not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('cart_show', { title: 'Cart Items:', user: results.user, motorcycle_cart_items: results.user_motorcycle_cart_items, gear_cart_items: results.user_gear_cart_items } );
    });
}

// Find items then populate?