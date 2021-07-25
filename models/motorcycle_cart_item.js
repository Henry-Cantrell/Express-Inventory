var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MotorcycleCartItemSchema = new Schema(
  {
    user: {type: Schema.ObjectId, ref: 'User', required: true},
    motorcycle: {type: Schema.ObjectId, ref: 'Motorcycle', required:true}
  }
);

//Export model
module.exports = mongoose.model('MotorcycleCartItem', MotorcycleCartItemSchema);
