var assert = require('assert')
  , should = require('should')
  , http = require('http')
  , jsonBody = require('body/json')
  , connect = require('connect')
  , broker
  , publisher;

describe('Publisher', function() {

  it('should send message to broker', function(done) {
    broker = connect().use(function(req, res) {

      req.url.should.equal('/publish/myevent');
      
      jsonBody(req, res, function(err, body) {
        
        assert.ok(body.testdata);

        done();
      });
    });

    http.createServer(broker).listen(4001);

    publisher = require('../rest/publisher.js').pub('http://localhost:4001');

    publisher.send('myevent', {testdata: true});
  });

  it('should format url', function(done) {
    broker = connect().use(function(req, res) {

      req.url.should.equal('/publish/myevent');
      
      done();
    });

    http.createServer(broker).listen(4002);

    publisher = require('../rest/publisher.js').pub('http://localhost:4002/');

    publisher.send('myevent', {testdata: true});
  });

});
