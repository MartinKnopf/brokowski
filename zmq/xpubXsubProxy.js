/**
 * This is a zeromq XPUB/XSUB proxy.
 */
function ZmqBrokowski() {
  this.zmq = require('zmq');
  this.xpub = this.zmq.socket('xpub');
  this.xsub = this.zmq.socket('xsub');
  this.pub = this.zmq.socket('pub');
  this.sub = this.zmq.socket('sub');
  var self = this;

  this.xsub.on('message', function(msg) { // forward published message
    self.xpub.send(msg);
  });

  this.xpub.on('message', function(msg) { // forward subscription
    self.xsub.send(msg);
  });
};

ZmqBrokowski.prototype.start = function(xsubPort, xpubPort) {
  this.xsub.bindSync('tcp://127.0.0.1:' + (xsubPort ? xsubPort : '5000'));
  this.xpub.bindSync('tcp://127.0.0.1:' + (xpubPort ? xpubPort : '5001'));
  return this;
}

ZmqBrokowski.prototype.close = function() {
  this.xsub.close();
  this.xpub.close();
  return this;
}

exports.zmq = function() {
  return new ZmqBrokowski();
}