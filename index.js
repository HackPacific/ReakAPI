require('dotenv').config();
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Pusher = require('pusher');
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/reak_development');
var Message = require('./models/message');

var pusher = new Pusher({
  appId: process.env.PusherAppId,
  key: process.env.PusherKey,
  secret: process.env.PusherSecret,
  encrypted: true
});

app.get('/messages', function(req, res) {
  Message.find({}, function(err, messages) {
    messages = messages.map(function(item){
      return item.content;
    });

    res.send(messages);
  });
});

app.post('/messages', function(req, res) {
  var message = new Message({content: req.body.content});
  message.save(function(err, message) {

    Message.find({}, function(err, messages) {
      messages = messages.map(function(item){
        return item.content;
      });

      pusher.trigger('messages', 'new_message', {
        messages: messages
      });
 
      res.send(messages);
    });

  });
});

app.listen(3000, function() {
  console.log('Reak API listening on port 3000...')
});
