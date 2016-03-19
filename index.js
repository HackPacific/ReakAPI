require('dotenv').config({silent: true});
require('newrelic');

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Pusher = require('pusher');
var bodyParser = require('body-parser')
var request = require('request');

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
  request('https://graph.facebook.com/debug_token?input_token=' + req.query.token + '&access_token=' + process.env.FB_APP_TOKEN, function (error, response, body) {
    if (JSON.parse(body).data.is_valid) {
      Message.find({}, function(err, messages) {
        messages = messages.map(function(item){
          return item.content;
        });

        res.send(messages);
      });
    } else {
      res.send({ authorized: false });
    }
  })

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

app.get('/auth_check', function(req, res) {
  request('https://graph.facebook.com/debug_token?input_token=' + req.query.input_token + '&access_token=' + process.env.FB_APP_TOKEN, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Print the google web page.
    }

    res.send(body);
  })
});

app.get('/loaderio-04a20ca317ade1f424e601e7424811a3', function(req, res) {
  res.send('loaderio-04a20ca317ade1f424e601e7424811a3');
});

app.listen(app.get('port'), function() {
  console.log('ThreeTwoOne API listening on port', app.get('port'));
});
