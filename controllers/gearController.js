var GearType = require('../models/gear_type');
var Gear = require('../models/gear');
var Brand = require('../models/brand')
var async = require('async');
const { body,validationResult } = require("express-validator");

// Display list of all gear.
exports.gear_list = function(req, res, next) {

  Gear.find()
    .exec(function (err, gear_list) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('gear_list', { title: 'Motorcycle Gear', gear_list: gear_list, listing_creator: listing_creator });
    });
};

// Display detail page for a specific gear.
exports.gear_detail = function(req, res, next) {

    async.parallel({

      gear: function(callback) {
            
        Gear.findById(req.params.id)
          .populate('brand')
          .populate('gear_type')
          .populate('listing_creator')
          .exec(callback);
    },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.gear==null) { // No results.
            var err = new Error('gear not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('gear_detail', { title: 'Gear Details:', gear: results.gear } );
    });

};


// Display gear create form on GET.
exports.gear_create_get = function(req, res, next) {

//Retrieve all brands and gear types

async.parallel({
  brands: function(callback) {
      Brand.find(callback);
  },
  gear_types: function(callback) {
      GearType.find(callback);
  },
}, function(err, results) {
  if (err) { return next(err); }
  res.render('gear_form', { title: 'Create New Gear', brands: results.brands, gear_types: results.gear_types });
});
};

// Handle gear create on POST.
exports.gear_create_post =  [

  // Validate and santize the name field.
  body('gear_name', 'gear name required').trim().isLength({ min: 1 }).escape(),
  body('summary', 'summary required').trim().isLength({ min: 1 }).escape(),
  body('brand', 'brand required').trim().isLength({ min: 1 }).escape(),
  body('gear_type', 'gear_type required').trim().isLength({ min: 1 }).escape(),
  body('listing_creator', 'User must not be empty').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a gear object with escaped and trimmed data.
    var gear = new Gear(
      { gear_name: req.body.gear_name,
        summary: req.body.summary,
        brand: req.body.brand,
        gear_type: req.body.gear_type,
        listing_creator: req.body.listing_creator
      }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('gear_form', { title: 'Create gear', gear: gear, errors: errors.array()});
      return;
    }
    else {
      // Data from form is valid.
      // Check if gear with same name already exists.
      Gear.findOne({ 'gear_name': req.body.gear_name })
        .exec( function(err, found_gear) {
           if (err) { return next(err); }

           if (found_gear) {
             // gear exists, redirect to its detail page.
             res.redirect('/');
           }
           else {

             gear.save(function (err) {
               if (err) { return next(err); }
               // gear saved. Redirect to gear detail page.
               res.redirect('/');
             });

           }

         });
    }
  }
];
// Display gear delete form on GET.
exports.gear_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: gear delete GET');
};

// Handle gear delete on POST.
exports.gear_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: gear delete POST');
};

// Display gear update form on GET.
exports.gear_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: gear update GET');
};

// Handle gear update on POST.
exports.gear_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: gear update POST');
};
