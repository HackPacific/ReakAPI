var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
  author           : ObjectId,
  name             : String,
  facebookUserId   : String,
  date             : Date
});

module.exports = mongoose.model('User', userSchema);
