# A banal UDP server for IoT devices

````
IoT devices -> { json } -> UDP server -> HTTP REST -> Thingspeak -> Visualization
                            |      ^
                         IoT s/n   |
                            |      |
                            |  TS write key
                            v      |
                            Redis db
````

Each IOT-device will regularly send a JSON-blob to the UDP server. The JSON schema is

````
const iotMessage = {
  up: 100,                // uptime in seconds
  p1: 1,                  // PM1
  p2: 2,                  // PM2.5
  p4: 4,                  // PM4
  p10: 10,                // PM10
  sn: "982758BFB4C3E2C4", // serial number
  rssi: 31                // receive signal strength
};
````
The UDP server does the following:

- Receive the JSON from the IOT device
- Using the IOT device serial number, look up the corresponding Thingspeak channel number
- Using an HTTPS GET, send the data from the IOT device to the Thingspeak channel
- Thingspeak provides easy manipulation and retrieval of this time-series data

### Thingspeak REST call

````
https://api.thingspeak.com/update?api_key=XXXXXXXXXXXXXXXXXXXX&field1=1&field2=3

````
- api_key: a key that uniquely identifies a Thingspeak channel
- field1...field8: up to 8 data fields 

How the Thingspeak fields are used:

- Field1 = pm2.5
- Field2 = pm10
- Field3 = RSSI
- Field4 = not used
- Field5 = uptime
- Field6 = client version
- Field7 = pm1
- Field8 = pm4

Please don't ask why the ordering of the fields is the way it is

## Useful PM2 stuff for running the miniudpserver

### Start the server
The ````--watch```` option ensure auto-restart when source changes (e.g. after a git pull):

````pm2 start miniudpserver.js --watch````

### Save the currently running list of PM2 processes
Do this after every time a new process is added, but not required after simply restarting a process:

````pm2 save````

### Ensure PM2 restarts all saved processes after a server reboot. 
- First generate a startup script

````
$ pm2 startup
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/opt/bitnami/nodejs/bin /opt/bitnami/nodejs/lib/node_modules/pm2/bin/pm2 startup systemd -u username --hp /home/username
````
- Then run the startup script as root

````
$ sudo env PATH=$PATH:/opt/bitnami/nodejs/bin /opt/bitnami/nodejs/lib/node_modules/pm2/bin/pm2 startup systemd -u username --hp /home/username
````
- The generating and running the startup script is only required once
- To undo the effect of ````pm2 startup```` simply do ````pm2 unstartup````
- Saving the startup config ````pm2 save```` should be done after every change


### Redis key-value (only for udpserver, not used in miniudpserver)
The Redis database contains the mapping from IoT-device serial number and the Thingspeak channel. 
- IoT serial number: This is the hardwired device ID inside the SPS particle sensor
- Thingspeak channel: A single Thingspeak channel contains the time-series data for a single IoT device
Each Redis Key-Value pair is therefore:
- Key: IoT device serial number
- Value: Write-key for the corresponding Thingspeak
- The key-value pair represents a one-to-one relationship between IoT device and Thingspeak channel

### Provisioning of an IoT device
The provisioning, or configuration, of an IoT device simply means entering key-value pair in the Redis database. There is no other configuration of the IoT device.

### CLI manipulation of Redis key-value store
The following is useful for manually messing around with the Redis key-value store:

````
# Set key "iot-982758BFB4C3E2C4" to value "XXXXXXXXXXXXXXXXXXXX"
echo -n XXXXXXXXXXXXXXXXX  | redis-cli -x set iot-982758BFB4C3E2C4

# Get the value of key "iot-982758BFB4C3E2C4"
redis-cli get iot-982758BFB4C3E2C4

# List all "iot" keys 
redis-cli keys "iot-*"
````
