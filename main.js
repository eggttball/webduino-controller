require("webduino-js");
require("webduino-blockly");

var soil;
var led;
var myData;

function get_time(t) {
  var varTime = new Date(),
    varHours = varTime.getHours(),
    varMinutes = varTime.getMinutes(),
    varSeconds = varTime.getSeconds();
  var varNow;
  if (t == "hms") {
    varNow = varHours + ":" + varMinutes + ":" + varSeconds;
  } else if (t == "h") {
    varNow = varHours;
  } else if (t == "m") {
    varNow = varMinutes;
  } else if (t == "s") {
    varNow = varSeconds;
  }
  return varNow;
}


boardReady({board: 'Smart', device: '10VWvbPy', transport: 'mqtt', multi: true}, function (board) {
  board.samplingInterval = 1000;
  soil = getSoil(board, 0);
  led = getLed(board, 5);
  myData= {};
  myData.sheetUrl = 'https://docs.google.com/spreadsheets/d/1TPlkMaNcz2ApMa-v1WkmH6EUI1QJmbfnXzQlAmcijDw/edit?usp=sharing';
  myData.sheetName = '工作表1';
  soil.measure(function (val) {
    soil.detectedVal = val;
    //document.getElementById('demo-area-01-show').innerHTML = soil.detectedVal;
    myData.column0 = get_time("hms");
    myData.column1 = soil.detectedVal;
    writeSheetData(myData);
    if (soil.detectedVal < 50) {
      led.on();
    } else {
      led.off();
    }
  });
});


var http = require('http');
var server = http.createServer(function (req, res) {
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write('<html><body><h1>土壤濕度 : ' + soil.detectedVal + '</h1></body></html>');
    res.end();
});
server.listen();
