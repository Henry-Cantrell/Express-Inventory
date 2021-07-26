var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MotorcycleSchema = new Schema(
  {
    model: {type: String, required: true},
    manufacturer: {type: Schema.ObjectId, ref: 'Manufacturer', required: true },
    summary: {type: String, required: true},
    type: {type: Schema.ObjectId, ref: 'Type', required: true },
    listing_creator: {type: Schema.ObjectId, ref: 'User', required: true},
    count: {type: Number, required: true}
  }
);

// Virtual for motorcycle's URL
MotorcycleSchema
.virtual('url')
.get(function () {
  return '/inventory/motorcycle/' + this._id;
});

//Export model
module.exports = mongoose.model('Motorcycle', MotorcycleSchema);
