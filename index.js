var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/reak_development');
var Message = require('./models/message');

app.get('/messages', function(req, res) {
  Message.find({}, function(err, messages) {
    res.send(messages);
  });
});

app.post('/messages', function(req, res) {
  var message = new Message({content: 'test'});
  message.save(function(err, message) {
    res.send(message);
  });
});

app.listen(3000, function() {
  console.log('Reak API listening on port 3000...')
});
