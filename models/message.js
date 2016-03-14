var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var messageSchema = new Schema({
  author    : ObjectId,
  content   : String,
  date      : Date
});

module.exports = mongoose.model('Message', messageSchema);
