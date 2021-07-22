var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ManufacturerSchema = new Schema(
  {
    manufacturer_name: {type: String, required: true, maxLength: 100},
    country: {type: String, required: true, maxLength: 100},
  }
);

// Virtual for 's URL
ManufacturerSchema
.virtual('url')
.get(function () {
  return '/inventory/manufacturer/' + this._id;
});

//Export model
module.exports = mongoose.model('Manufacturer', ManufacturerSchema);
