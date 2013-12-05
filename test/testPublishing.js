var assert = require('assert')
  , should = require('should')
  , pubsub
  , request;

describe('PubSub', function() {

  describe('publishing', function() {

    beforeEach(function() {
      request = {};
      pubsub = require('../routes/pubsub.js')(request);
    });

    it('should return 200', function(done) {
      subscribe('event', 'http://localhost:4730/event', 'POST');

      pubsub.publish({
        params: {
          event: 'event'
        },
        body: {}
      }, {
        send: function(statusCode) { statusCode.should.equal(200); done(); }
      });
    });

    it('should notify subscriber by POST', function(done) {
      request.post = function(options) { options.url.should.equal('http://localhost:4730/event'); };

      subscribe('event', 'http://localhost:4730/event', 'POST');

      pubsub.publish({
        params: {
          event: 'event'
        },
        body: {}
      }, {
        send: function(statusCode) { done(); }
      });
    });

    it('should notify subscriber by GET', function(done) {
      request.get = function(options) { options.url.should.equal('http://localhost:1111/event'); };

      subscribe('event', 'http://localhost:1111/event', 'GET');

      pubsub.publish({
        params: {
          event: 'event'
        },
        body: {}
      }, {
        send: function(statusCode) { done(); }
      });
    });

    it('should notify multiple subscribers', function(done) {
      request.get = function(options) { options.url.should.equal('http://localhost:1111/event'); };
      request.post = function(options) { options.url.should.equal('http://localhost:2222/event'); };

      subscribe('event', 'http://localhost:1111/event', 'GET');
      subscribe('event', 'http://localhost:2222/event', 'POST');

      pubsub.publish({
        params: {
          event: 'event'
        },
        body: {}
      }, {
        send: function(statusCode) { done(); }
      });
    });

    it('should send data to subscriber', function(done) {
      request.post = function(options) { options.json.test.should.be.ok(); };

      subscribe('event', 'http://localhost:4730/event', 'POST');

      pubsub.publish({
        params: {
          event: 'event'
        },
        body: { test: true }
      }, {
        send: function(statusCode) { done(); }
      });
    });

    it('should skip broken subscriber', function(done) {
      request.post = function(options) { if(options.url == 'brok3n url') throw new Error(); };

      subscribe('event', 'brok3n url', 'POST');
      subscribe('event', 'http://localhost/goodurl', 'POST');

      pubsub.publish({
        params: {
          event: 'event'
        },
        body: {}
      }, {
        send: function(statusCode) { statusCode.should.equal(200); done(); }
      });
    });

    it('should skip subscriber when method invalid', function(done) {
      subscribe('event', 'http://localhost/goodurl', 'INVALID_HTTP_METHOD');

      pubsub.publish({
        params: {
          event: 'event'
        },
        body: {}
      }, {
        send: function(statusCode) { statusCode.should.equal(200); done(); }
      });
    });
  });
});

var subscribe = function(event, url, method) {
  pubsub.subscribe({
    params: {
      event: event
    },
    body: {
      subscriber: url,
      method: method
    }
  }, {
    send: function(statusCode) {}
  });
};