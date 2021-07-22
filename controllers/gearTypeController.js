var gearType = require('../models/gear_type');
var Gear = require('../models/gear');
var async = require('async');
const { body,validationResult } = require("express-validator");

// Display list of all gearType.
exports.gearType_list = function(req, res, next) {

  GearType.find()
    .sort([['name', 'ascending']])
    .exec(function (err, gearType_list) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('gearType_list', { title: 'Types of Motorcycle Gear', gearType_list: gearType_list });
    });
};

// Display detail page for a specific gearType.
exports.gearType_detail = function(req, res, next) {

    async.parallel({
        gearType: function(callback) {
            GearType.findById(req.params.id)
              .exec(callback);
        },

        gearType_gear: function(callback) {
            Gear.find({ 'gearType': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.gearType==null) { // No results.
            var err = new Error('gearType not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('gearType_detail', { title: 'gearType Detail', gearType: results.gearType, gearType_gear: results.gearType_gear } );
    });

};


// Display gearType create form on GET.
exports.gearType_create_get = function(req, res, next) {
  res.render('gearType_form', { title: 'Create gearType' });
};

// Handle gearType create on POST.
exports.gearType_create_post =  [

  // Validate and santize the name field.
  body('name', 'gearType name required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a gearType object with escaped and trimmed data.
    var gearType = new GearType(
      { gearType_name: req.body.gearType_name }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('gearType_form', { title: 'Create gearType', gearType: gearType, errors: errors.array()});
      return;
    }
    else {
      // Data from form is valid.
      // Check if gearType with same name already exists.
      GearType.findOne({ 'gearType_name': req.body.gearType_name })
        .exec( function(err, found_gearType) {
           if (err) { return next(err); }

           if (found_gearType) {
             // gearType exists, redirect to its detail page.
             res.redirect(found_gearType.url);
           }
           else {

             gearType.save(function (err) {
               if (err) { return next(err); }
               // gearType saved. Redirect to gearType detail page.
               res.redirect(gearType.url.slice(6));
             });

           }

         });
    }
  }
];
// Display gearType delete form on GET.
exports.gearType_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: gearType delete GET');
};

// Handle gearType delete on POST.
exports.gearType_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: gearType delete POST');
};

// Display gearType update form on GET.
exports.gearType_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: gearType update GET');
};

// Handle gearType update on POST.
exports.gearType_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: gearType update POST');
};
