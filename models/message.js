var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var messageSchema = new Schema({
  sender    : ObjectId,
  receiver  : ObjectId,
  content   : String,
  date      : Date
});

module.exports = mongoose.model('Message', messageSchema);
