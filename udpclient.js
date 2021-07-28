/*
 * Simple UDP Client
 * For testing miniudpserver.js
 * 
 *  HD, 2001
 */

// Process command line

var argv = require('minimist')(process.argv.slice(2));
const port = argv.port || 5683;
const ip = argv.ip || 'localhost';
const sn = argv.sn || '982758BFB4C3E2C4';
const rssi = argv.rssi || 29;
const p1 = argv.p1 || 1.2;
const argvHelp = argv.help;

const testMessage = {
  up: 100,    // uptime in seconds
  p1: p1,     // PM1
  p2: 2.5,    // PM2.5
  p4: 4.0,    // PM4
  p10: 10,    // PM10
  sn: sn,     // serialno
  rssi: rssi  // receive signal strength
};

const msg = argv.msg || JSON.stringify(testMessage);

// Print some usage info if required

if (argvHelp === true || port === true || ip === true || msg === true || sn === true) {
  console.log('Usage: node udpclient.js [--port <port>] [--ip <ipaddr>] [--msg "Message"] [--sn <serialno>] [--help]');
  console.log('   --port: Default value is 5683');
  console.log('   --ip: Default value is localhost');
  console.log('   --msg: JSON-formatted value ');
  console.log('   --sn: IOT-device serial number, default 982758BFB4C3E2C4');
  process.exit();
}
console.log(`udpclient: ${ip}:${port} ${msg}`)

// Create socket

var dgram = require('dgram');
var client = dgram.createSocket('udp4');

// Send message and quit

client.send(Buffer.from(msg), port, ip, () => {
  console.log('udpclient: message sent');
  setTimeout(() => {
    client.close();
  }, 1000)
});

client.on('error', (err) => {
  console.log('udpclient error');
  client.close();
});
