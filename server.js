var SerialPort = require('serialport');
//ttyACM0
var serial = new SerialPort('/dev/ttyUSB0', {
  parser: SerialPort.parsers.readline('\r\n'),
  baudrate: 115200,
});

var request = require('request');
var rand = Math.floor(Math.random()*100000000).toString();

// Add data read event listener
serial.on('data', function (chunk) {

  var data = JSON.parse(chunk);
  var options = {
    uri: 'http://home.suriona.com/home-monitor/api/hydrometries',
    method: 'POST',
    json: {
      room: "579b40bb50088b03002850ed",
      inside_temperature: data.temperature,
      inside_humidity: data.humidity
    }
  };
request('http://www.prevision-meteo.ch/services/json/pecq', function (error, response, body) {
  body = JSON.parse(body);
  console.log('body', body.current_condition);
  options.json.outside_temperature = body.current_condition.tmp;
  options.json.outside_humidity = body.current_condition.humidity;

	request.post(options, function (error, response, body) {
    if(response.statusCode == 201){
      console.log('document saved as: https://arcane-atoll-59798.herokuapp.com/api/hydrometries');
    } else {
      console.log('error: '+ response.statusCode);
      console.log(body);
    }
  });
});
  console.log('temperature: ', data.temperature);
  console.log('humidity: ', data.humidity);
});

serial.on('error', function (msg) {
  console.log('error: ' + msg);
});
