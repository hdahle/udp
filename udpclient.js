var argv = require('minimist')(process.argv.slice(2));

const port = argv.port || 8080;
const ip = argv.ip || 'localhost';
const msg = argv.msg || 'hello';

if (port === true || ip === true || msg === true) {
  console.log('Usage: node eia.js [--port <port>] [--ip <ipaddr>] --msg "Message"');
  console.log('   --port: Default value is 8080')
  console.log('   --ip: Default value is localhost')
  console.log('   --msg: Default value is "hello" ')
  process.exit();
}

console.log('port', port)
console.log('ip', ip)
console.log('msg', msg)

var dgram = require('dgram');
var client = dgram.createSocket('udp4');
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
