module.exports = function(app, Schema, Lib) {
  // Messages
  require('./messages/index')(app, Schema, Lib);
  require('./messages/create')(app, Schema, Lib);

  // Users
  require('./users/create')(app, Schema, Lib);

  // Others
  require('./others/loaderio-04a20ca317ade1f424e601e7424811a3')(app, Schema, Lib);
}
