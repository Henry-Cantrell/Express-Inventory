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
          .populate('gear_cart_item')
          .populate('motorcycle_cart_item')
          .exec(callback);
    },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.user==null) { // No results.
            var err = new Error('user not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('cart_show', { title: 'Cart Items:', user: results.user } );
    });
}