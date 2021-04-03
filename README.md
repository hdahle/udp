# A banal UDP server for IoT devices

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
- Each IOT device has a unique Thingspeak channel which stores the time-series data 
- Thingspeak provides easy manipulation and retrieval of this time-series data

### Thingspeak REST call

````
https://api.thingspeak.com/update?api_key=75YBFS7GXF6Q8MZY&field1=1&field2=3

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

### Redis key-value 
Key: IoT device serial number
Value: Write-key for the corresponding Thingspeak
The key-value pair represents a one-to-one relationship between IoT device and Thingspeak channel

### CLI manipulation of Redis key-value store

````echo -n VALUE | redis-cli -x set KEY````

````echo -n 75YBFS7GXF6Q8MZY  | redis-cli -x set iot-982758BFB4C3E2C4 ````

By prefixing each key with "iot-" we can easily list all iot-keys with

````redis-cli keys "iot-*"````
