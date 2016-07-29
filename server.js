var SerialPort = require('serialport');

var serial = new SerialPort('/dev/ttyACM0', {
  parser: SerialPort.parsers.readline('\r\n'),
  baudrate: 115200,
});

var request = require('request');
var rand = Math.floor(Math.random()*100000000).toString();

// Add data read event listener
serial.on('data', function (chunk) {

  var data = JSON.parse(chunk);
  var options = {
    uri: 'https://arcane-atoll-59798.herokuapp.com/api/hydrometries',
    method: 'POST',
    json: {
      room: "5793cd567899cf0410b8bbb9",
      temperature: data.temperature,
      humidity: data.humidity
    }
  };
  request.post(options, function (error, response, body) {
    if(response.statusCode == 201){
      console.log('document saved as: https://arcane-atoll-59798.herokuapp.com/api/hydrometries');
    } else {
      console.log('error: '+ response.statusCode);
      console.log(body);
    }
  });
  console.log('temperature: ', data.temperature);
  console.log('humidity: ', data.humidity);
});

serial.on('error', function (msg) {
  console.log('error: ' + msg);
});
