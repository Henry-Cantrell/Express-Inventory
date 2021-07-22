var Brand = require('../models/brand');
var Gear = require('../models/gear');
var async = require('async');
const { body,validationResult } = require("express-validator");

// Display list of all brand.
exports.brand_list = function(req, res, next) {

  Brand.find()
    .sort([['name', 'ascending']])
    .exec(function (err, brand_list) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('brand_list', { title: 'Brands', brand_list: brand_list });
    });
};

// Display detail page for a specific brand.
exports.brand_detail = function(req, res, next) {

    async.parallel({
        brand: function(callback) {
            Brand.findById(req.params.id)
              .exec(callback);
        },

        brand_gears: function(callback) {
            Gear.find({ 'brand': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.brand==null) { // No results.
            var err = new Error('brand not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('brand_detail', { title: 'Brand Details', brand: results.brand, brand_gears: results.brand_gears } );
    });

};


// Display brand create form on GET.
exports.brand_create_get = function(req, res, next) {
  res.render('brand_form', { title: 'Create New Brand' });
};

// Handle brand create on POST.
exports.brand_create_post =  [

  // Validate and santize the name field.
  body('brand_name', 'brand_name required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a brand object with escaped and trimmed data.
    var brand = new Brand(
      { brand_name: req.body.brand_name }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('brand_form', { title: 'Create brand', brand: brand, errors: errors.array()});
      return;
    }
    else {
      // Data from form is valid.
      // Check if brand with same name already exists.
      Brand.findOne({ 'brand_name': req.body.brand_name })
        .exec( function(err, found_brand) {
           if (err) { return next(err); }

           if (found_brand) {
             // brand exists, redirect to its detail page.
             res.redirect(found_brand.url);
           }
           else {

             brand.save(function (err) {
               if (err) { return next(err); }
               // brand saved. Redirect to home page.
               res.redirect('/');
             });

           }

         });
    }
  }
];
// Display brand delete form on GET.
exports.brand_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: brand delete GET');
};

// Handle brand delete on POST.
exports.brand_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: brand delete POST');
};

// Display brand update form on GET.
exports.brand_update_get = function(req, res, next) {

  // Get brand, brands and types for form.
  async.parallel({
      brand: function(callback) {
          Brand.findById(req.params.id).populate('type').populate('brand').exec(callback);
      },
      }, function(err, results) {
          if (err) { return next(err); }
          if (results.brand==null) { // No results.
              var err = new Error('brand not found');
              err.status = 404;
              return next(err);
          }
          // Success.
          
          res.render('brand_form', { title: 'Update brand', brand: results.brand });
      });

};


// Handle brand update on POST.
exports.brand_update_post = [
 
  // Validate and sanitize field.
  body('brand_name', 'brand must not be empty.').trim().isLength({ min: 1 }).escape(),


  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a brand object with escaped/trimmed data and old id.
      var brand = new Brand(
        { brand_name: req.body.brand_name,
          _id: req.params.id
         });

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.

          async.parallel({
            brand: function(callback) {
                Brand.findById(req.params.id)
                  .exec(callback);
            },
    
            brand_gears: function(callback) {
                Gear.find({ 'brand': req.params.id })
                  .exec(callback);
            },
    
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.brand==null) { // No results.
                var err = new Error('brand not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render
            res.render('brand_form', { title: 'Update brand', brand: results.brand, brand_gears: results.brand_gears, errors: errors.array()});;
        });
          
          return;
      }
      else {
          // Data from form is valid. Update the record.
          Brand.findByIdAndUpdate(req.params.id, brand, {}, function (err,thebrand) {
              if (err) { return next(err); }
                 // Successful - redirect to brand detail page.
                 res.redirect(thebrand.url);
              });
      }
  }
];
