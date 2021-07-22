var Type = require('../models/type');
var Motorcycle = require('../models/motorcycle');
var async = require('async');
const { body,validationResult } = require("express-validator");

// Display list of all type.
exports.type_list = function(req, res, next) {

  Type.find()
    .sort([['name', 'ascending']])
    .exec(function (err, type_list) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('type_list', { title: 'Motorcycle Categories', type_list: type_list });
    });
};

// Display detail page for a specific type.
exports.type_detail = function(req, res, next) {

    async.parallel({
        type: function(callback) {
            type.findById(req.params.id)
              .exec(callback);
        },

        type_motorcycle: function(callback) {
            Motorcycle.find({ 'type': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.type==null) { // No results.
            var err = new Error('type not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('type_detail', { title: 'Type Details:', type: results.type, type_motorcycle: results.type_motorcycle } );
    });

};


// Display type create form on GET.
exports.type_create_get = function(req, res, next) {
  res.render('type_form', { title: 'Create Motorcycle Type' });
};

// Handle type create on POST.
exports.type_create_post =  [

  // Validate and santize the name field.
  body('name', 'type name required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a type object with escaped and trimmed data.
    var type = new Type(
      { type_name: req.body.type_name }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('type_form', { title: 'Create type', type: type, errors: errors.array()});
      return;
    }
    else {
      // Data from form is valid.
      // Check if type with same name already exists.
      Type.findOne({ 'type_name': req.body.type_name })
        .exec( function(err, found_type) {
           if (err) { return next(err); }

           if (found_type) {
             // type exists, redirect to its detail page.
             res.redirect(found_type.url);
           }
           else {

             type.save(function (err) {
               if (err) { return next(err); }
               // type saved. Redirect to type detail page.
               res.redirect(type.url.slice(6));
             });

           }

         });
    }
  }
];
// Display type delete form on GET.
exports.type_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: type delete GET');
};

// Handle type delete on POST.
exports.type_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: type delete POST');
};

// Display type update form on GET.
exports.type_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: type update GET');
};

// Handle type update on POST.
exports.type_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: type update POST');
};
