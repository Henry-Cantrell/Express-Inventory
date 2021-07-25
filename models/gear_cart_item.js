var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GearCartItemSchema = new Schema(
  {
    user: {type: Schema.ObjectId, ref: 'User', required: true},
    gear: {type: Schema.ObjectId, ref: 'Gear', required:true}
  }
);

//Export model
module.exports = mongoose.model('GearCartItem', GearCartItemSchema);
