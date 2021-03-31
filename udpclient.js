


var argv = require('minimist')(process.argv.slice(2));

let port = argv.port || 8080;   // end date
let ip = argv.ip || 'localhost';
let msg = argv.msg || 'message';


//console.log('Usage: node eia.js [--port <port>] [--ip <ipaddr>]');
//console.log('   --port: Default value is 8080')
//console.log('   --ip: Default value is localhost')
//  process.exit();


var dgram = require('dgram');
var s = dgram.createSocket('udp4');
s.send(Buffer.from(msg), port, ip);
