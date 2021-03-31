// Simple UDP Client
// HD, 2001

// Process command line

var argv = require('minimist')(process.argv.slice(2));
const port = argv.port || 5683;
const ip = argv.ip || 'localhost';
const msg = argv.msg || 'hello';

// Print some usage info if required

if (port === true || ip === true || msg === true) {
  console.log('Usage: node eia.js [--port <port>] [--ip <ipaddr>] --msg "Message"');
  console.log('   --port: Default value is 8080')
  console.log('   --ip: Default value is localhost')
  console.log('   --msg: Default value is "hello" ')
  process.exit();
}
console.log('udpclient: port', port, 'ip', ip, 'msg', msg)

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
