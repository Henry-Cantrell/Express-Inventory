var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TypeSchema = new Schema(
  {
    name: {type: String, required: true, min: 3, max: 20},
  }
);

// Virtual for type's URL
TypeSchema
.virtual('url')
.get(function () {
  return '/type/' + this._id;
});

//Export model
module.exports = mongoose.model('Type', TypeSchema);
