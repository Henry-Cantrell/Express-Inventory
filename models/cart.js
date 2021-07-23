var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// To insert gear/motorcycles into cart: currentUser.cart.motorcycles.push(motorcycle._id)
// and substitute syntax as needed for gear insertion.

var CartSchema = new Schema (
{
   motorcycles: {[type: ObjectID, ref: 'Motorcycle']},
   gears: {[type: ObjectID, ref: 'Gear']}
}
);

// Virtual for gear's URL
CartSchema
.virtual('url')
.get(function () {
  return '/users/cart/' + this._id;
});

//Export model
module.exports = mongoose.model('Cart', CartSchema);
