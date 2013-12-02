var assert = require('assert')
  , should = require('should')
  , http = require('http')
  , request = require('request')
  , app;

beforeEach(function() {
  app = require('../app.js');
});

// BAD TESTS: app should be shutdown after each test

describe('PubSub', function() {

  describe('subscribing', function() {

    it('should return 200', function() {
      request.post({url: 'http://localhost:3000/subscribe/eventomat', json: {subscriber: 'http://localhost:3000/eventomat'}}, function(err, res, body) {
        res.statusCode.should.equal(200);
      });
    });

    it('should return 405 when subscriber\'s url is missing', function() {
      request.post('http://localhost:3000/subscribe/eventomat', function(err, res, body) {
        res.statusCode.should.equal(405);
      });
    });
  });

  describe('publishing', function() {

    it('should return 200', function() {
      request.post('http://localhost:3000/publish/eventomat', function(err, res, body) {
        res.statusCode.should.equal(200);
      });
    });

    it('should notify subscriber', function(done) {

      // create subscriber
      var express = require('express')
        , subscriber = express();
      subscriber.post('/event-yxcsgdghb', function(req, res) {
        done(); // subscriber should get notified
      });
      subscriber.listen(4730);

      // subscribe
      request.post({url: 'http://localhost:3000/subscribe/event-yxcsgdghb', json: {subscriber: 'http://localhost:4730/event-yxcsgdghb'}});
      
      // publish
      request.post({url: 'http://localhost:3000/publish/event-yxcsgdghb', json: {}});
    });

    it('should notify multiple subscribers', function(done) {
      var subscriber1Notified, subscriber2Notified = false;

      // create subscriber1
      var express = require('express')
        , subscriber1 = express();
      subscriber1.post('/event-vhhgf', function(req, res) {
        subscriber1Notified = true;
        if(subscriber2Notified) done();
      });
      subscriber1.listen(4731);

      // subscribe
      request.post({url: 'http://localhost:3000/subscribe/event-vhhgf', json: {subscriber: 'http://localhost:4731/event-vhhgf'}});
      
      // create subscriber2
      var subscriber2 = express();
      subscriber2.post('/event-vhhgf', function(req, res) {
        subscriber2Notified = true;
        if(subscriber1Notified) done();
      });
      subscriber2.listen(4732);

      // subscribe
      request.post({url: 'http://localhost:3000/subscribe/event-vhhgf', json: {subscriber: 'http://localhost:4732/event-vhhgf'}});
      
      // publish
      request.post({url: 'http://localhost:3000/publish/event-vhhgf', json: {}});
    });

    it('should send data to subscriber', function(done) {

      // create subscriber
      var express = require('express')
        , subscriber = express();
      subscriber.use(express.bodyParser());
      subscriber.post('/event-dgfhdfhfhgjhf', function(req, res) {
        req.body.test.should.be.ok;
        done(); // subscriber should get notified
      });
      subscriber.listen(4733);

      // subscribe
      request.post({url: 'http://localhost:3000/subscribe/event-dgfhdfhfhgjhf', json: {subscriber: 'http://localhost:4733/event-dgfhdfhfhgjhf'}});
      
      // publish
      request.post({url: 'http://localhost:3000/publish/event-dgfhdfhfhgjhf', json: {test: true}});
    });

    it('to a subscriber with an illegal url should not let eventbus server crash', function() {
      request.post({url: 'http://localhost:3000/subscribe/event-sdufhsdufh', json: {subscriber: 'http:/sdlkfjsds..sdtomat'}});
      request.post({url: 'http://localhost:3000/subscribe/event-sdfsdfggg', json: {subscriber: 'http://google.de'}});

      request.post('http://localhost:3000/publish/event-sdufhsdufh', function(err, res, body) {
        res.statusCode.should.equal(500);
      });

      // publishing should still be possible
      request.post('http://localhost:3000/publish/event-sdfsdfggg', function(err, res, body) {
        res.statusCode.should.equal(200);
      });
    });
  });
});