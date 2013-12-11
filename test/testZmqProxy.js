var zmq = require('zmq')
  , zmqBroker = require('../brokowski').zmq().start(6000, 6001)
  , assert = require('assert')
  , should = require('should');

describe('subscribing', function() {

  it('should start on default ports', function(done) {
    var zmqBroker = require('../brokowski').zmq().start()
      , pub = zmq.socket('pub')
      , sub = zmq.socket('sub');

    sub.subscribe('event');
    sub.on('message', function(msg) {
      done();
    });

    sub.connect('tcp://127.0.0.1:5001');

    pub.connect('tcp://127.0.0.1:5000');

    setTimeout(function() {
      pub.send('event is cool');
    }, 100.0);
    
  });

  it('should close proxy sockets', function(done) {
    zmqBroker.close();

    zmq.socket('pub').bind('6001', function() {
      zmq.socket('sub').bind('6000', function() {
        done(); // if we could successfully bind sockets to these ports, they were free in the first place
      });
    });
  });
});