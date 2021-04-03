/*
 * udpserver.js - based on a snippet from w3schools.com
 * Receive data from IoT devices
 * Send data to corresponding Thingspeak channels
 *
 * HD, 2001
 */

var fetch = require('node-fetch');
var moment = require('moment');
const momFmt = 'YY-MM-DD hh:mm:ss';
var redis = require('redis');
var redClient = redis.createClient();

redClient.on('connect', function () {
  console.log(moment().format(momFmt) + ' Redis client connected');
});
redClient.on('ready', function () {
  console.log(moment().format(momFmt) + ' Redis client ready');
});
redClient.on('warning', function () {
  console.log(moment().format(momFmt) + ' Redis warning');
});
redClient.on('error', function (err) {
  console.log(moment().format(momFmt) + ' Redis error:' + err);
});

// create socket
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

// datagram received. parse it and send to thingspeak
server.on('message', function (msg, rinfo) {
  console.log(moment().format(momFmt) + ' udpserver received: ', rinfo, msg.toString());
  let data;
  try {
    data = JSON.parse(msg.toString());
  } catch (err) {
    console.log(moment().format(momFmt) + ' udpserver: invalid json received');
    return;
  }
  sendToThingspeak(data);
});

server.on('listening', function () {
  console.log(moment().format(momFmt) + ' udpserver listening at port:    ', server.address().port);
});
server.on('close', function () {
  console.log(moment().format(momFmt) + ' udpserver: socket closed');
});
server.on('error', function (error) {
  console.log(`${moment().format(momFmt)} Error: ${error}`);
  server.close();
});

// Port 5683 is often used for CoAP
server.bind(5683);


// Massage data and send to Thingspeak
// incoming data: {"up":54576,"p1":0.81,"p2":0.85,"p4":0.85,"p10":0.85,"sn":"982758BFB4C3E2C4","rssi":31} 
// https://api.thingspeak.com/update?api_key=75YBFS7GXF6Q8MZY&field1=0
// Field1 = pm2.5        Field5 = uptime
// Field2 = pm10         Field6 = client version
// Field3 = RSSI         Field7 = pm1
// Field4 = not used     Field8 = pm4
function sendToThingspeak(data) {
  const redisKey = "iot-" + data.sn;
  redClient.get(redisKey, function (error, value) {
    if (value) {
      console.log(moment().format(momFmt) + ' Redis value:' + value);
      const url = `https://api.thingspeak.com/update?api_key=${value}&field1=${data.p2}&field2=${data.p10}&field3=${data.rssi}&field5=${data.up}&field7=${data.p1}&field8=${data.p4}`
      fetch(url)
        .then(response => response.text())
        .then(result => {
          console.log(moment().format(momFmt) + ' Fetch result:', result)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      console.log(moment().format(momFmt) + ' Error: ' + error);
    }
  });
}