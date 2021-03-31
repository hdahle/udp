/*
 * udpserver.js - based on a snippet from w3schools.com
 *
 *
 *  HD, 2001
 */

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('message', function (msg, rinfo) {
  console.log('udpserver received: ', msg.length, msg.toString());
});

server.on('listening', function () {
  var port = server.address().port;
  console.log('udpserver port:    ', port);
});

server.on('close', function () {
  console.log('udpserver: socket closed');
});

server.on('error', function (error) {
  console.log('Error: ' + error);
  server.close();
});

server.bind(8080);

