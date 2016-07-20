var SerialPort = require('serialport');

var serial = new SerialPort('/dev/cu.usbmodem1411', {
  parser: SerialPort.parsers.readline('\r\n'),
  baudrate: 115200,
});

// Add data read event listener
serial.on('data', function (chunk) {

  var data = JSON.parse(chunk);
  console.log('temperature: ', data.temperature);
  console.log('humidity: ', data.humidity);
});

serial.on('error', function (msg) {
  console.log('error: ' + msg);
});
