var gear_cart_item = require('../models/gear_cart_item');
var motorcycle_cart_item = require('../models/motorcycle_cart_item');
var async = require('async');
const { body,validationResult } = require("express-validator");

// Display cart items on get

exports.cart_show = function (req, res, next) {
res.render('cart_show');
}