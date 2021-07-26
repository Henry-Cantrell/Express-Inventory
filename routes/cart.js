var express = require('express');
var router = express.Router();

// Controller imports

var gear_cart_item_controller = require('../controllers/gearCartItemController');
var motorcycle_cart_item_controller = require('../controllers/motorcycleCartItemController');
var cart_controller = require('../controllers/cartController');

// Handle cart display

router.get("/show/:id", cart_controller.cart_show);

// Handle posts for motorcycle and gear item creations

router.post("/gear/add", gear_cart_item_controller.gearCartItem_create_post);
router.post("/motorcycle/add", motorcycle_cart_item_controller.motorcycleCartItem_create_post);

// Handle deletion of motorcycle and gear items

module.exports = router;