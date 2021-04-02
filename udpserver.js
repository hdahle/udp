/*
 * udpserver.js - based on a snippet from w3schools.com
 *
 *
 *  HD, 2001
 */

var argv = require('minimist')(process.argv.slice(2));
const apikey = argv.apikey;

if (apikey === true || !apikey) {
  console.log('Usage: node udpserver.js --apikey <thingspeak apikey>');
  process.exit();
}

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('message', function (msg, rinfo) {
  console.log('udpserver received: ', msg.length, msg.toString(), rinfo);
  try {
    const data = JSON.parse(msg.toString())
  } catch (err) {
    console.log('invalid json');
    return;
  }
  sendToThingspeak(data);
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

//
// {"up":54576,"p1":0.81,"p2":0.85,"p4":0.85,"p10":0.85,"sn":"982758BFB4C3E2C4","rssi":31} 
//
function sendToThingspeak(data) {

  // Use GET 
  // https://api.thingspeak.com/update?api_key=75YBFS7GXF6Q8MZY&field1=0

  // Field1 = pm2.5
  // Field2 = pm10
  // Field3 = RSSI
  // Field4 = 
  // Field5 = uptime
  // Field6 = client version
  // Field7 = pm1
  // Field8 = pm4

  let url = "https://api.thingspeak.com/update?api_key=" + apikey
    + "&field1=" + data.p25
    + "&field2=" + data.p10
    + "&field3=" + data.rssi
    + "&field5=" + data.up
    + "&field7=" + data.p1
    + "&field8=" + data.p4
  console.log('sendToThingspeak:', url)
}