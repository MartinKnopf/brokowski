var assert = require('assert')
  , should = require('should')
  , request = require('request')
  , pubsub;

describe('PubSub', function() {

  describe('subscribing', function() {

    beforeEach(function(done) {
      pubsub = require('../routes/pubsub.js')(request);
      pubsub.clear();
      done();
    });

    it('should return 200 when everything is ok', function(done) {
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

    it('should return 500 on repeated subscription', function(done) {
      pubsub.subscribe({
        params: {
          event: 'event'
        },
        body: {
          subscriber: 'http://localhost:3000/eventomat',
          method: 'POST'
        }
      }, {
        send: function(statusCode) { statusCode.should.equal(200); }
      });
      pubsub.subscribe({
        params: {
          event: 'event'
        },
        body: {
          subscriber: 'http://localhost:3000/eventomat',
          method: 'POST'
        }
      }, {
        send: function(statusCode) { statusCode.should.equal(500); done(); }
      });
    });

    it('should return 400 when subscriber\'s url is missing', function(done) {
      pubsub.subscribe({
        params: {
          event: 'event'
        },
        body: {
          method: 'POST'
        }
      }, {
        send: function(statusCode) { statusCode.should.equal(400); done(); }
      });
    });

    it('should return 400 when subscriber\'s method is missing', function(done) {
      pubsub.subscribe({
        params: {
          event: 'event'
        },
        body: {
          subscriber: 'http://localhost:3000/eventomat'
        }
      }, {
        send: function(statusCode) { statusCode.should.equal(400); done(); }
      });
    });

    it('should return 400 when subscriber\'s method is invalid', function(done) {
      pubsub.subscribe({
        params: {
          event: 'event'
        },
        body: {
          subscriber: 'http://localhost:3000/eventomat',
          method: 'INVALID_HTTP_METHOD'
        }
      }, {
        send: function(statusCode) { statusCode.should.equal(400); done(); }
      });
    });
  });
});