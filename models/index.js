module.exports = function() {
  var Message = require('./message');
  var Session = require('./session');
  var User = require('./user');

  return {
    Message: Message,
    User: User,
    Session: Session
  }
}
