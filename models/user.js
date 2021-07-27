var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 100},
    motorcycle_cart_items: [{type: Schema.ObjectId, ref: 'motorcycle_cart_item'}],
    gear_cart_items: [{type: Schema.ObjectId, ref: 'gear_cart_item'}]
  }
);

//Export model
module.exports = mongoose.model('User', UserSchema);
