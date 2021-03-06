var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var sessionSchema = new Schema({
  user_id          : ObjectId,
  token            : String,
  date             : Date
});

module.exports = mongoose.model('Session', sessionSchema);
