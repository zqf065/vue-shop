var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productSchema = new Schema({
  'productId': {type: String},
  'prodcutName': String,
  'salePrice': Number,
  'checked': String,
  'productNum': Number,
  'productImage': String
});
module.exports = mongoose.model('Good', productSchema);
