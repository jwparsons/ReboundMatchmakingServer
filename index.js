var express = require('express');
var socket = require('socket.io');
var execFile = require('child_process').execFile;
var events = require('events');

// handle server creation
var eventEmitter = new events.EventEmitter();

// keep track of player queue
var clients = []

// app setup
var app = express();
var server = app.listen(3000, function() {
  console.log('Listening to requests on port 3000');
});

// socket setup
var io = socket(server);

// create server when told to do so
var createServer = function() {
  // create new server
  execFile('reboundRun.bat', function callback(err, data){
    console.log(err);
    console.log(data.toString());
  });
}
eventEmitter.on('createServer', createServer);

// handle server requests
io.on('connection', function(socket) {
  console.log('made socket connection', socket.id);

  socket.on('join', function(data) {
    console.log(socket.id + ' wants to join a game');
    clients.push(socket.id);
    if (clients.length >= 4) {
      eventEmitter.emit('createServer');
    }
  });

  socket.on('cancel', function(data) {
    clients.pop(socket.id);
    console.log(socket.id + ' changed their mind');
  });

  socket.on('server creation', function(data) {
    console.log('server has been created' + '_' + data + '_');
    if (clients.length >= 4) {
      // send clients server port number
      for ( i = 0; i < 4; i++)
        socket.broadcast.to(clients.shift()).emit('join game', data);
    }
    else {
      // tell server to die lol
      socket.broadcast.to(socket.id).emit('terminate', 'poop');
    }
  });
});
