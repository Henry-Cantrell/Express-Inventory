var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 100},
    cart: {type: Schema.ObjectId, ref: 'Cart', required: true}
  }
);

//Export model
module.exports = mongoose.model('User', UserSchema);
