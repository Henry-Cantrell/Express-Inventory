var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GearSchema = new Schema(
  {
    gear_name: {type: String, required: true},
    brand: {type: Schema.ObjectId, ref: 'Brand', required: true},
    summary: {type: String, required: true},
    gear_type: {type: Schema.ObjectId, ref: 'GearType', required:true},
    listing_creator: {type: Schema.ObjectId, ref: 'User', required: true},
    count: {type: Number, required: true}
  }
);

// Virtual for gear's URL
GearSchema
.virtual('url')
.get(function () {
  return '/inventory/gear/' + this._id;
});

//Export model
module.exports = mongoose.model('Gear', GearSchema);
