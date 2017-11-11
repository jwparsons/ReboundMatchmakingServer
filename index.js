var express = require('express');
var socket = require('socket.io');

// app setup
var app = express();
var server = app.listen(3000, function() {
  console.log('Listening to requests on port 3000');
});

// socket setup
var io = socket(server);

io.on('connection', function(socket) {
  console.log('made socket connection', socket.id);
});
