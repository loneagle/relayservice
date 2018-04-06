const udp = require('dgram');

let port = 3000;

let Device = module.exports;

module.exports.sendOrder = (port, ip) => {
  const client = udp.createSocket('udp4');
  buffer = Buffer.from(1);
  client.send(buffer, port, ip, function(err) {
    console.log('send to ' + ip +":"+ port);
    if (err) throw err;
    client.close();
  });
};

module.exports.sendReqStatus = (port, ip) => {
  const client = udp.createSocket('udp4');
  buffer = Buffer.from(2);
  client.send(buffer, port, ip, function(err) {
    console.log('send request of status to ' + ip +":"+ port);
    if (err) throw err;
    client.close();
  });
};

module.exports.getStatus = (callback) => {
  const server = udp.createSocket('udp4');
  server.on('message', function(msg, info) {
    try {
        Device.editDeviceStatus(msg[1],msg[2]);
    } catch (e) {
      console.log(e);
    }
  });
  server.bind(port);
};
