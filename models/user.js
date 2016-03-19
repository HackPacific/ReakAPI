var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
  id               : ObjectId,
  first_name       : String,
  last_name        : String,
  email            : String,
  fb_user_id       : String,
  fb_expires_at    : Number,
  date             : Date
});

module.exports = mongoose.model('User', userSchema);
