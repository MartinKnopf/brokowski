var assert = require('assert')
  , should = require('should')
  , pubsub
  , request = require('request');

describe('PubSub', function() {

  describe('subscribing', function() {

    beforeEach(function() {
      pubsub = require('../routes/pubsub.js')(request);
    });

    it('should return 200', function(done) {
      pubsub.subscribe({
        params: {
          event: 'event'
        },
        body: {
          subscriber: 'http://localhost:3000/eventomat',
          method: 'POST'
        }
      }, {
        send: function(statusCode) { statusCode.should.equal(200); done(); }
      });
    });

    it('should return 405 when subscriber\'s url is missing', function(done) {
      pubsub.subscribe({
        params: {
          event: 'event'
        },
        body: {
          method: 'POST'
        }
      }, {
        send: function(statusCode) { statusCode.should.equal(405); done(); }
      });
    });

    it('should return 405 when subscriber\'s method is missing', function(done) {
      pubsub.subscribe({
        params: {
          event: 'event'
        },
        body: {
          subscriber: 'http://localhost:3000/eventomat'
        }
      }, {
        send: function(statusCode) { statusCode.should.equal(405); done(); }
      });
    });

    it('should return 405 when subscriber\'s method is invalid', function(done) {
      pubsub.subscribe({
        params: {
          event: 'event'
        },
        body: {
          subscriber: 'http://localhost:3000/eventomat',
          method: 'INVALID_HTTP_METHOD'
        }
      }, {
        send: function(statusCode) { statusCode.should.equal(405); done(); }
      });
    });
  });
});