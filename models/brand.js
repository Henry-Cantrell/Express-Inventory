var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BrandSchema = new Schema(
  {
    brand_name: {type: String, required: true, maxLength: 100},
  }
);

// Virtual for brand's URL
BrandSchema
.virtual('url')
.get(function () {
  return '/inventory/brand/' + this._id;
});

//Export model
module.exports = mongoose.model('Brand', BrandSchema);
