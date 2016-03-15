require('dotenv').config({silent: true});

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Pusher = require('pusher');
var bodyParser = require('body-parser')

app.set('port', (process.env.PORT || 3000));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var MONGOLAB_URI = process.env.MONGOLAB_URI;
mongoose.connect(MONGOLAB_URI);

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

app.listen(app.get('port'), function() {
  console.log('Reak API listening on port', app.get('port'));
});
