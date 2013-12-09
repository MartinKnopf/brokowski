var zmq = require('zmq')
  , assert = require('assert')
  , should = require('should');

describe('subscribing', function() {

  it.only('should', function(done) {
    var xpub = zmq.socket('xpub')
      , xsub = zmq.socket('xsub')
      , pub = zmq.socket('pub')
      , sub = zmq.socket('sub');

    xsub.bindSync('inproc://xsub');
    xpub.connect('inproc://xsub');
    xpub.bindSync('inproc://xpub');
    xsub.connect('inproc://xpub');

    sub.bindSync('inproc://sub');
    xpub.connect('inproc://sub');
    
    sub.subscribe('event');

    sub.on('message', function(msg) {
      done();
    });

    xsub.on('message', function(msg) {
      done();
    });

    pub.connect('inproc://xsub');

    setTimeout(function() {
      pub.send('event is cool');
    }, 100.0);
    
  });

  it('should return 200', function(done) {
    var pub = zmq.socket('pub')
      , sub = zmq.socket('sub');

    sub.bindSync('inproc://pub');
    pub.connect('inproc://pub');
    sub.subscribe('js');

    sub.on('message', function(msg){
      done();
    });

    setTimeout(function() {
      pub.send('js is cool');
    }, 100.0);

  });

});