/*
 * udpserver.js - based on a snippet from w3schools.com
 * Receive data from IoT devices
 * Send data to corresponding Thingspeak channels
 *
 * HD, 2001
 */

var lut = require('./iotlut');
var fetch = require('node-fetch');

// create socket
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

// Port 5683 is often used for CoAP so lets just use it here also
server.bind(5683);

server.on('listening', function () {
  console.log('udpserver: Listening port', server.address().port);
});
server.on('close', function () {
  console.log('udpserver: Socket closed');
});
server.on('error', function (error) {
  console.log(`udpserver: Error ${error}`);
  server.close();
});

// datagram received. parse it and send to thingspeak
server.on('message', function (msg, rinfo) {
  console.log('udpserver:', rinfo.address, msg.toString());
  let data;
  try {
    data = JSON.parse(msg.toString());
  } catch (err) {
    console.log('udpserver: Invalid json rcvd');
    return;
  }
  if (isNaN(data.p1) || isNaN(data.p2) || isNaN(data.p4) || isNaN(data.p10) || isNaN(data.up) || isNaN(data.rssi)) {
    console.log('udpserver: Unexpected JSON');
    return;
  }
  if (data.sn === undefined) {
    console.log('udpserver: Serialno missing');
    return;
  }
  const tsChannel = lut.iotLut('iot-' + data.sn);
  if (!tsChannel)
    console.log('udpserver: no channel for', data.sn)
  else
    sendToThingspeak(data, tsChannel);
});


// Massage data and send to Thingspeak
// incoming data: {"up":54576,"p1":0.81,"p2":0.85,"p4":0.85,"p10":0.85,"sn":"982758BFB4C3E2C4","rssi":31} 
// https://api.thingspeak.com/update?api_key=75YBFS7GXF6Q8MZY&field1=0
// Field1 = pm2.5        Field5 = uptime
// Field2 = pm10         Field6 = client version
// Field3 = RSSI         Field7 = pm1
// Field4 = not used     Field8 = pm4
function sendToThingspeak(data, thingSpeakChannel) {
  const url = `https://api.thingspeak.com/update?api_key=${thingSpeakChannel}&field1=${data.p2}&field2=${data.p10}&field3=${data.rssi}&field5=${data.up}&field7=${data.p1}&field8=${data.p4}`
  fetch(url)
    .then(response => response.text())
    .then(result => console.log(`udpserver: chan ${thingSpeakChannel} result ${result}`))
    .catch(err => console.log(err))
}

