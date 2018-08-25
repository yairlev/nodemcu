
var wifi = require("Wifi");
const storage = require('Storage');

//WiFi host ip
const HOST_IP = '192.168.1.1';
//WiFi port
const HOST_PORT = 80;

//Rendered HTML
function onPageRequest(req, res) {
  var html = "<html> <head> <style> ul.days { list-style: none; } .days li { display: inline; padding: 5px; background-color: gray; border-radius: 2px; cursor: pointer; } .days li.selected { background-color: aquamarine; } </style> <script> document.addEventListener(\"DOMContentLoaded\", function () { document.querySelectorAll(\"li\").forEach((e) => { e.addEventListener(\"click\", (t) => { e.classList.toggle('selected'); }); }) }); const WebSocket = require(\"ws\"); var ws = new WebSocket(HOST_IP, { path: '/', port: HOST_PORT, keepAlive: 60 }); ws.on('open', function () { console.log(\"Connected to server\"); }); ws.on('message', function (msg) { console.log(\"MSG: \" + msg); }); </script> </head> <body> <div> <ul class=\"days\"> <li id=\"d2\">Mon</li> <li id=\"d3\">Tue</li> <li id=\"d4\">Wed</li> <li id=\"d5\">Thu</li> <li id=\"d6\">Fri</li> <li id=\"d7\">Sat</li> <li id=\"d1\">Sun</li> </ul> </div> <table> <tr> <td>STRAT</td> <td>STOP</td> </tr> <tr> <td> <input type=\"time\" id=\"startTime\" min=\"0:00\" max=\"23:00\" required /> </td> <td> <input type=\"time\" id=\"endTime\" min=\"1:00\" max=\"24:00\" required /> </td> </tr> </table> <button onclick=\"save()\">Save</button> </body> </html>";

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}



// Start everything
function init() {
  //var l;setInterval(() => {digitalWrite(2,l=!l);},1000);
  //storage.write('data', { "test": 1 });
  //console.log(storage.read('data'));

  wifi.setAPIP({ ip: HOST_IP, gw: HOST_IP, netmask: "255.255.255.0" }, () => { console.log('IP set!'); });
  
  //Start WiFi server
  wifi.startAP('EspruinoAP', { password: 'z1x2c3v4', authMode: 'wpa2' }, function (err) {
    if (err) throw err;
    console.log("Wifi Server ready!");
    const server = require('ws').createServer(onPageRequest).listen(HOST_PORT);
    
    //Start web socket server
    server.on("websocket", function (ws) {
      ws.on('message', function (msg) { print("[WS] " + JSON.stringify(msg)); });
      ws.on('open', function () {
        // For WebSocket clients only
        console.log("Connected to server");
      });

      ws.on('message', function (msg) {
        console.log("MSG: " + msg);
      });

      ws.on('close', function () {
        console.log("Connection closed");
      });

      ws.on('handshake', function () {
        console.log("Handshake Success");
      });

      ws.on('ping', function () {
        console.log("Got a ping");
      });

      ws.on('pong', function () {
        console.log("Got a pong");
      });

      ws.on('rawData', function (msg) {
        console.log("RAW: " + msg);
      });

    });
  });
}

init();
