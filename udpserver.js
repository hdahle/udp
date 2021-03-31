/*
 * udpserver.js - based on a snippet from w3schools.com
 *
 *
 *  HD, 2001
 */

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('message', function (msg, rinfo) {
  console.log('udpserver received: ', msg.length, msg.toString(), rinfo);
});

server.on('listening', function () {
  console.log('udpserver port:    ', server.address().port);
});

server.on('close', function () {
  console.log('udpserver: socket closed');
});

server.on('error', function (error) {
  console.log('Error: ' + error);
  server.close();
});

server.bind(5683);

