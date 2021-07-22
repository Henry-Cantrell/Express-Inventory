var Motorcycle = require('../models/motorcycle');
var Manufacturer = require('../models/manufacturer');
var Type = require('../models/type');
var async = require('async');
const { body,validationResult } = require("express-validator");

exports.index = function(req, res) {

  async.parallel({
      motorcycle_count: function(callback) {
          Motorcycle.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      gear_count: function(callback) {
          Gear.countDocuments({}, callback);
      },
      manufacturer_count: function(callback) {
          Manufacturer.countDocuments({}, callback);
      },
  }, function(err, results) {
      res.render('index', { title: 'Bikes', error: err, data: results });
  });
};

// Display list of all motorcycle.
exports.motorcycle_list = function(req, res, next) {

  Motorcycle.find()
    .sort([['name', 'ascending']])
    .exec(function (err, motorcycle_list) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('motorcycle_list', { title: 'Motorcycles', motorcycle_list: motorcycle_list });
    });
};

// Display detail page for a specific motorcycle.
exports.motorcycle_detail = function(req, res, next) {

    async.parallel({
        motorcycle: function(callback) {
            
            Motorcycle.findById(req.params.id)
              .populate('type')
              .populate('manufacturer')
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.motorcycle==null) { // No results.
            var err = new Error('motorcycle not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('motorcycle_detail', { title: 'Motorcycle Details', motorcycle: results.motorcycle } );
    });
};


// Display motorcycle create form on GET.
exports.motorcycle_create_get = function(req, res, next) {

  //Retrieve all manufacturers and motorcycle types
  
  async.parallel({
    manufacturers: function(callback) {
        Manufacturer.find(callback);
    },
    types: function(callback) {
        Type.find(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    res.render('motorcycle_form', { title: 'Create New Motorcycle', manufacturers: results.manufacturers, types: results.types });
  });
  };
  
// Handle motorcycle create on POST.
exports.motorcycle_create_post = [

  // Validate and sanitize fields.
  body('model', 'Model must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('manufacturer', 'Manufacturer must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('type', 'Type must not be empty').trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
      

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a motorcycle object with escaped and trimmed data.
      var motorcycle = new Motorcycle(
        { model: req.body.model,
          manufacturer: req.body.manufacturer,
          summary: req.body.summary,
          type: req.body.type
         });

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.

          // Get all types and manufacturers for form.
          async.parallel({
              types: function(callback) {
                  Type.find(callback);
              },
              manufacturers: function(callback) {
                  Manufacturer.find(callback);
              },
          }, function(err, results) {
              if (err) { return next(err); }

              res.render('motorcycle_form', { title: 'Create Motorcycle', manufacturers:results.manufacturers, types: results.types, motorcycle: results.motorcycle, errors: errors.array() });
          });
          return;
      }
      else {
          // Data from form is valid. Save motorcycle.
          motorcycle.save(function (err) {
              if (err) { return next(err); }
                 // Successful - redirect to new motorcycle record.
                 res.redirect('/');
              });
      }
  }
];

// Display motorcycle delete form on GET.
exports.motorcycle_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: motorcycle delete GET');
};

// Handle motorcycle delete on POST.
exports.motorcycle_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: motorcycle delete POST');
};

// Display motorcycle update form on GET.
exports.motorcycle_update_get = function(req, res, next) {

    // Get motorcycle, manufacturers and types for form.
    async.parallel({
        motorcycle: function(callback) {
            Motorcycle.findById(req.params.id).populate('type').populate('manufacturer').exec(callback);
        },
        types: function(callback) {
            Type.find(callback);
        },
        manufacturers: function(callback) {
            Manufacturer.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.motorcycle==null) { // No results.
                var err = new Error('motorcycle not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            
            res.render('motorcycle_form', { title: 'Update motorcycle', types:results.types, manufacturers:results.manufacturers, motorcycle: results.motorcycle });
        });

};


// Handle motorcycle update on POST.
exports.motorcycle_update_post = [
   
    // Validate and sanitize fields.
    body('model', 'Model must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('manufacturer', 'Manufacturer must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('type', 'Type must not be empty').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a motorcycle object with escaped/trimmed data and old id.
        var motorcycle = new Motorcycle(
          { model: req.body.model,
            manufacturer: req.body.manufacturer,
            summary: req.body.summary,
            type: req.body.type,
            _id: req.params.id
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form
            async.parallel({
                manufacturers: function(callback) {
                    Manufacturer.find(callback);
                },
                types: function(callback) {
                    Type.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('motorcycle_form', { title: 'Update motorcycle',manufacturers:results.manufacturers, types:results.types, motorcycle: motorcycle, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Motorcycle.findByIdAndUpdate(req.params.id, motorcycle, {}, function (err,themotorcycle) {
                if (err) { return next(err); }
                   // Successful - redirect to motorcycle detail page.
                   res.redirect(themotorcycle.url);
                });
        }
    }
];