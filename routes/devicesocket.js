var app = require('http').createServer();
var io = require('socket.io')(app);
var fs = require('fs');
let port = 3000;
app.listen(port);
console.log('TCP Server started on port ' + port);

function ParseJson(jsondata) {
  try {
    return JSON.parse(jsondata);
  } catch (error) {
    return null;
  }
}

function sendTime() {
    io.sockets.emit('atime', { time: new Date().toJSON() });
}

io.on('connection', function(socket) {
  console.log("Connected");
  // socket.emit('welcome', {
  //   message: 'Connected !!!11111111111!'
  // });
  socket.on('connection', function(data) {
    console.log(data);
  });
  socket.on('JSON', function(data) {
    var jsonStr = JSON.stringify(data);
    var parsed = ParseJson(jsonStr);
    console.log(parsed);
  });
});
