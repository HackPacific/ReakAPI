// Load Environment variables
require('dotenv').config({silent: true});

// Load performance tracker with New Relic
require('newrelic');

// Initial application in express.js
var express = require('express');
var app = express();

// Load MongoDB
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI);

var Message = require('./models/message');

var Schema = {
  Message: Message
}

// Load Request Parser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// Load Request Maker
var request = require('request');

// Set Port #
app.set('port', (process.env.PORT || 3000));

// Load Pusher
var Pusher = require('pusher');

var pusher = new Pusher({
  appId: process.env.PusherAppId,
  key: process.env.PusherKey,
  secret: process.env.PusherSecret,
  encrypted: true
});

// Load all Libraries
var Lib = {
  Pusher: pusher,
  Request: require('request')
}

// Load all API routes
require('./routes/api/v1/index')(app, Schema, Lib);

// Start Web Server
app.listen(app.get('port'), function() {
  console.log('ThreeTwoOne API listening on port', app.get('port'));
});
