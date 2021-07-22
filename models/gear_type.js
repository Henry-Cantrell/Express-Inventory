var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GearTypeSchema = new Schema(
  {
    name: {type: String, required: true, min: 3, max: 20},
  }
);

// Virtual for GearType's URL
GearTypeSchema
.virtual('url')
.get(function () {
  return '/gear_type/' + this._id;
});

//Export model
module.exports = mongoose.model('GearType', GearTypeSchema);
