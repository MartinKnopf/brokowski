var assert = require('assert')
  , should = require('should')
  , http = require('http')
  , jsonBody = require('body/json')
  , connect = require('connect')
  , broker
  , Pub = require('../lib/publisher.js')
  , publisher;

describe('Publisher', function() {

  it('should fail when no broker provided', function(done) {
    try {
      publisher = new Pub();
    } catch(e) {
      done();
    }
  });

  it('should send message to broker', function(done) {
    broker = connect().use(function(req, res) {

      req.url.should.equal('/publish/myevent');
      
      jsonBody(req, res, function(err, body) {
        
        assert.ok(body.testdata);

        done();
      });
    });

    http.createServer(broker).listen(4001);

    publisher = new Pub({broker: 'http://127.0.0.1:4001'});

    publisher.send('myevent', {testdata: true});
  });

  it('should format url', function(done) {
    broker = connect().use(function(req, res) {

      req.url.should.equal('/publish/myevent');
      
      done();
    });

    http.createServer(broker).listen(4002);

    publisher = new Pub({broker: 'http://127.0.0.1:4002/'});

    publisher.send('myevent', {testdata: true});
  });

});
