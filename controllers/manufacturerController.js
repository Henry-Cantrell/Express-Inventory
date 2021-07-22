var Manufacturer = require('../models/manufacturer');
var Motorcycle = require('../models/motorcycle');
var async = require('async');
const { body,validationResult } = require("express-validator");

// Display list of all manufacturer.
exports.manufacturer_list = function(req, res, next) {

  Manufacturer.find()
    .sort([['name', 'ascending']])
    .exec(function (err, manufacturer_list) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('manufacturer_list', { title: 'Manufacturers', manufacturer_list: manufacturer_list });
    });
};

// Display detail page for a specific manufacturer.
exports.manufacturer_detail = function(req, res, next) {

    async.parallel({
        manufacturer: function(callback) {
            Manufacturer.findById(req.params.id)
              .exec(callback);
        },

        manufacturer_motorcycles: function(callback) {
            Motorcycle.find({ 'manufacturer': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.manufacturer==null) { // No results.
            var err = new Error('manufacturer not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('manufacturer_detail', { title: 'Manufacturer Details', manufacturer: results.manufacturer, manufacturer_motorcycles: results.manufacturer_motorcycles } );
    });

};


// Display manufacturer create form on GET.
exports.manufacturer_create_get = function(req, res, next) {
  res.render('manufacturer_form', { title: 'Create New Manufacturer' });
};

// Handle manufacturer create on POST.
exports.manufacturer_create_post =  [

  // Validate and santize the name field.
  body('manufacturer_name', 'manufacturer name required').trim().isLength({ min: 1 }).escape(),
  body('country', 'country required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a manufacturer object with escaped and trimmed data.
    var manufacturer = new Manufacturer(
      { manufacturer_name: req.body.manufacturer_name, country: req.body.country }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('manufacturer_form', { title: 'Create manufacturer', manufacturer: manufacturer, errors: errors.array()});
      return;
    }
    else {
      // Data from form is valid.
      // Check if manufacturer with same name already exists.
      Manufacturer.findOne({ 'manufacturer_name': req.body.manufacturer_name })
        .exec( function(err, found_manufacturer) {
           if (err) { return next(err); }

           if (found_manufacturer) {
             // manufacturer exists, redirect to its detail page.
             res.redirect(found_manufacturer.url);
           }
           else {

             manufacturer.save(function (err) {
               if (err) { return next(err); }
               // manufacturer saved. Redirect to manufacturer detail page.
               res.redirect('/');
             });

           }

         });
    }
  }
];
// Display manufacturer delete form on GET.
exports.manufacturer_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: manufacturer delete GET');
};

// Handle manufacturer delete on POST.
exports.manufacturer_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: manufacturer delete POST');
};

// Display manufacturer update form on GET.
exports.manufacturer_update_get = function(req, res, next) {

  // Get manufacturer, manufacturers and types for form.
  async.parallel({
      manufacturer: function(callback) {
          Manufacturer.findById(req.params.id).populate('type').populate('manufacturer').exec(callback);
      },
      }, function(err, results) {
          if (err) { return next(err); }
          if (results.manufacturer==null) { // No results.
              var err = new Error('manufacturer not found');
              err.status = 404;
              return next(err);
          }
          // Success.
          
          res.render('manufacturer_form', { title: 'Update manufacturer', manufacturer: results.manufacturer });
      });

};


// Handle manufacturer update on POST.
exports.manufacturer_update_post = [
 
  // Validate and sanitize fields.
  body('country', 'Country must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('manufacturer_name', 'Manufacturer must not be empty.').trim().isLength({ min: 1 }).escape(),


  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a manufacturer object with escaped/trimmed data and old id.
      var manufacturer = new Manufacturer(
        { manufacturer_name: req.body.manufacturer_name,
          country: req.body.country,
          _id: req.params.id
         });

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.

          res.render('manufacturer_form', { title: 'Update Manufacturer', errors: errors.array()});
          
          return;
      }
      else {
          // Data from form is valid. Update the record.
          Manufacturer.findByIdAndUpdate(req.params.id, manufacturer, {}, function (err,themanufacturer) {
              if (err) { return next(err); }
                 // Successful - redirect to manufacturer detail page.
                 res.redirect(themanufacturer.url);
              });
      }
  }
];