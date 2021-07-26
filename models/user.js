var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 100},
  }
);

// Virtual for user's cart URL

UserSchema
.virtual('cart-url')
.get(function () {
  return '/cart/show/' + this._id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);
