var assert = require('assert')
  , should = require('should')
  , http = require('http')
  , jsonBody = require('body/json')
  , connect = require('connect')
  , request = require('request');

describe('[testSubscriber.js] Subscriber', function() {

  it('should fail when no name provided', function(done) {
    try {
      var subscriber = require('../lib/subscriber.js').sub({
        port: 6000,
        broker: 'http://127.0.0.1:5999'
      })
    } catch(e) {
      done();
    }
  });

  it('should fail when no name provided', function(done) {
    try {
      var subscriber = require('../lib/subscriber.js').sub({
        port: 6000,
        name: 'myservice'
      })
    } catch(e) {
      done();
    }
  });

  it('should subscribe at broker', function(done) {
    var broker = connect().use(function(req, res) {
      req.url.should.equal('/subscribe/myevent');
      done();
    });

    http.createServer(broker).listen(5999);

    var subscriber = require('../lib/subscriber.js').sub({
      port: 6000,
      name: 'myservice',
      broker: 'http://127.0.0.1:5999'
    }).start()

    subscriber.subscribe({
      event: 'myevent',
      method: 'GET'
    });
  });

  it('should subscribe to GET event', function(done) {
    var broker = connect().use(function(req, res) {
      jsonBody(req, res, function(err, body) {
        assert.equal(body.method, 'GET');
        assert.ok(req.url.indexOf('resubscribe') != -1);
        done();
      });
    });

    http.createServer(broker).listen(6001);

    var subscriber = require('../lib/subscriber.js').sub({
      port: 6002,
      name: 'myservice',
      broker: 'http://127.0.0.1:6001'
    }).start()

    subscriber.get('myevent', function() { /*empty handler*/ });
  });

  it('should subscribe to POST event', function(done) {
    var broker = connect().use(function(req, res) {
      jsonBody(req, res, function(err, body) {
        assert.equal(body.method, 'POST');
        assert.ok(req.url.indexOf('resubscribe') != -1);
        done();
      });
    });

    http.createServer(broker).listen(6003);

    var subscriber = require('../lib/subscriber.js').sub({
      port: 6004,
      name: 'myservice',
      broker: 'http://127.0.0.1:6003'
    }).start()

    subscriber.post('myevent', function() { /*empty handler*/ });
  });

  it('should subscribe to PUT event', function(done) {
    var broker = connect().use(function(req, res) {
      jsonBody(req, res, function(err, body) {
        assert.equal(body.method, 'PUT');
        assert.ok(req.url.indexOf('resubscribe') != -1);
        done();
      });
    });

    http.createServer(broker).listen(6005);

    var subscriber = require('../lib/subscriber.js').sub({
      port: 6006,
      name: 'myservice',
      broker: 'http://127.0.0.1:6005'
    }).start()

    subscriber.put('myevent', function() { /*empty handler*/ });
  });

  it('should subscribe to DELETE event', function(done) {
    var broker = connect().use(function(req, res) {
      jsonBody(req, res, function(err, body) {
        assert.equal(body.method, 'DELETE');
        assert.ok(req.url.indexOf('resubscribe') != -1);
        done();
      });
    });

    http.createServer(broker).listen(6007);

    var subscriber = require('../lib/subscriber.js').sub({
      port: 6008,
      name: 'myservice',
      broker: 'http://127.0.0.1:6007'
    }).start()

    subscriber.delete('myevent', function() { /*empty handler*/ });
  });

  it('should handle GET event and response 200', function(done) {
    var broker = connect().use(function(req, res) {});
    http.createServer(broker).listen(6009);

    var subscriber = require('../lib/subscriber.js').sub({
      port: 6010,
      name: 'myservice',
      broker: 'http://127.0.0.1:6009'
    }).start()
    subscriber.get('myevent', function(data) {
      assert.ok(data.stuff);
      done();
    });

    request.get({url: 'http://127.0.0.1:6010/myservice/myevent', json: {stuff: true}}, function (err, res, body) {
      assert.equal(res.statusCode, 200);
    });
  });

  it('should handle POST event and response 200', function(done) {
    var broker = connect().use(function(req, res) {});
    http.createServer(broker).listen(6011);

    var subscriber = require('../lib/subscriber.js').sub({
      port: 6012,
      name: 'myservice',
      broker: 'http://127.0.0.1:6011'
    }).start()
    subscriber.post('myevent', function(data) {
      assert.ok(data.stuff);
      done();
    });

    request.post({url: 'http://127.0.0.1:6012/myservice/myevent', json: {stuff: true}}, function (err, res, body) {
      assert.equal(res.statusCode, 200);
    });
  });

  it('should handle PUT event and response 200', function(done) {
    var broker = connect().use(function(req, res) {});
    http.createServer(broker).listen(6013);

    var subscriber = require('../lib/subscriber.js').sub({
      port: 6014,
      name: 'myservice',
      broker: 'http://127.0.0.1:6013'
    }).start()
    subscriber.put('myevent', function(data) {
      assert.ok(data.stuff);
      done();
    });

    request.put({url: 'http://127.0.0.1:6014/myservice/myevent', json: {stuff: true}}, function (err, res, body) {
      assert.equal(res.statusCode, 200);
    });
  });

  it('should handle DELETE event and response 200', function(done) {
    http.createServer(connect().use(function(req, res) {})).listen(6015);

    var subscriber = require('../lib/subscriber.js').sub({
      port: 6016,
      name: 'myservice',
      broker: 'http://127.0.0.1:6015'
    }).start()
    subscriber.delete('myevent', function(data) {
      assert.ok(data.stuff);
      done();
    });

    request.del({url: 'http://127.0.0.1:6016/myservice/myevent', json: {stuff: true}}, function (err, res, body) {
      assert.equal(res.statusCode, 200);
    });
  });

  it('should subscribe with default options', function(done) {
    var broker = connect().use(function(req, res) {
      jsonBody(req, res, function(err, body) {
        assert.equal(body.hostname, 'localhost');
        assert.equal(body.port, 6018);
        assert.equal(body.path, '/myservice/myevent');
        done();
      });
    });

    http.createServer(broker).listen(6017);

    var subscriber = require('../lib/subscriber.js').sub({
      port: 6018,
      name: 'myservice',
      broker: 'http://127.0.0.1:6017'
    }).start()

    subscriber.delete('myevent', function() { /*empty handler*/ });
  });

});