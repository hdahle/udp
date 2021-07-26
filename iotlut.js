const lut = [{
  sn: "iot-7E03257620B6905C",
  channel: "56G4RQDIPBQXZS1C"
}, {
  sn: "iot-5D4EBE683942FF05",
  channel: "Z6AF1ZBJZEZJKDQF"
}, {
  sn: "iot-982758BFB4C3E2C4",
  channel: "75YBFS7GXF6Q8MZY"

}, {
  sn: "iot-A0F0D983EC38E77D",
  channel: "Q3N9XE56GZTI7V47"
}];


exports.iotLut = function (iotSerialNo) {
  const res = lut.find(x => x.sn === iotSerialNo);
  if (res && res.channel) {
    return res.channel;
  }
  return null;
}

