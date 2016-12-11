var SerialPort = require('serialport');
var dotenv = require('dotenv-safe');

dotenv.load({
  path: __dirname + '/config/.env',
  sample: __dirname + '/config/.env.example',
  allowEmptyValues: false,
});

var serial = new SerialPort(process.env.USB_ADD, {
  parser: SerialPort.parsers.readline('\r\n'),
  baudrate: 115200,
});

var request = require('request');
var rand = Math.floor(Math.random() * 100000000).toString();

serial.on('data', function (chunk) {

  var data = JSON.parse(chunk);
  var weatherUrl = '';

  request(process.env.LOCAL_WEATHER_URL, function (error, response, body) {
    body = JSON.parse(body);

    var options = {
      uri: process.env.API_URL,
      method: 'POST',
      json: {
        room: process.env.ROOM_ID,
        inside_temperature: data.temperature,
        inside_humidity: data.humidity,
        outside_temperature: body.current_condition.tmp,
        outside_humidity: body.current_condition.humidity,
      },
    };

    request.post(options, function (error, response, body) {
      if (response.statusCode == 201) {
        console.log('document saved as: https://arcane-atoll-59798.herokuapp.com/api/hydrometries');
      } else {
        console.log('error: ' + response.statusCode);
        console.log(body);
      }
    });
  });

  console.log('Temperature: ', data.temperature);
  console.log('Humidity: ', data.humidity);
});

serial.on('error', function (msg) {
  console.log('error: ' + msg);
});
