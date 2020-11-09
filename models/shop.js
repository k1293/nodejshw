var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShopSchema = new Schema(
  {
    shopname: {type: String, required: true, max: 100},
    address: {type: String, required: true, max: 100},
    phone: {type: String, required: true, length: 10},
    owner: {type: String, required: true, max: 100},
  }
);


// Virtual for shop's URL
ShopSchema
.virtual('url')
.get(function () {
  return '/shop/' + this._id;
});

//Export model
module.exports = mongoose.model('Shop', ShopSchema);
