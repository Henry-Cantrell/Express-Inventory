var gear_cart_item = require('../models/gear_cart_item');
var motorcycle_cart_item = require('../models/motorcycle_cart_item');
var User = require('../models/user');
var async = require('async');
const { body,validationResult } = require("express-validator");

// Display cart items on get

exports.cart_show = function (req, res, next) {

      async.parallel({

      user: function(callback) {
            
        User.findById(req.params.id)
          .populate('gear_cart_items')
          .populate('motorcycle_cart_items')
          .exec(callback);
    },

    }, function(err, results) {
        if (err) { 
            return callback(err); 
        }
        else if (results.user==null) { // No results.
            var err = new Error('user not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('cart_show', { title: 'Cart Items:', user: results.user } );
    });
}