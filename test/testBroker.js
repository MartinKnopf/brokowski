var assert = require('assert')
  , should = require('should')
  , _ = require('lodash')
  , broker = require('../rest/broker.js')();

describe('[testBroker.js] Broker:', function() {

  beforeEach(function() {
    broker.clear();
  });

  describe('publishing', function() {

    it('should forward event to subscriber', function(done) {
      var sub = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      broker.subscribe('my-event', sub);

      sub.send = function(data) {
        done();
      };

      broker.publish('my-event', 'some data');
    });

    it.skip('should not forward event to subscriber of other event', function(done) {
    });

    it('should forward event to multiple subscribers', function(done) {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      var sub2 = {hostname:'localhost',port:8888,path:'path',method:'POST'};
      broker.subscribe('my-event', sub1);
      broker.subscribe('my-event', sub2);

      sub1.send = function(actualData) {
        actualData.should.equal('some data');
      };

      sub2.send = function(actualData) {
        actualData.should.equal('some data');
        done();
      };

      broker.publish('my-event', 'some data');
    });

    it('should send data to subscriber', function(done) {
      var sub = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      broker.subscribe('my-event', sub);

      sub.send = function(actualData) {
        actualData.should.equal('some data');
        done();
      };

      broker.publish('my-event', 'some data');
    });

    it('should skip broken subscriber', function(done) {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      var sub2 = {hostname:'localhost',port:8888,path:'path',method:'GET'};
      broker.subscribe('my-event', sub1);
      broker.subscribe('my-event', sub2);

      sub1.send = function(data) {
        throw new Error();
      };

      sub2.send = function(data) {
        done();
      };

      broker.publish('my-event', 'some data');
    });

    it.skip('should remove broken subscriber', function(done) {
    });
  });

  describe('subscribing', function() {

    it('should return 200 when everything is ok', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      broker.subscribe('my-event', sub1).should.equal(200);
    });

    it.skip('should default to round-robin', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      broker.subscribe('my-event', sub1);
    });

    it('should return 500 on repeated subscription', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      broker.subscribe('my-event', sub1);
      broker.subscribe('my-event', sub1).should.equal(500);
    });

    it('should return 400 when subscriber\'s hostname is missing', function() {
      var sub1 = {port:4444,path:'path',method:'POST'};
      broker.subscribe('my-event', sub1).should.equal(400);
    });

    it('should return 400 when subscriber\'s port is missing', function() {
      var sub1 = {hostname:'localhost',path:'path',method:'POST'};
      broker.subscribe('my-event', sub1).should.equal(400);
    });

    it('should return 400 when subscriber\'s path is missing', function() {
      var sub1 = {hostname:'localhost',port:4444,method:'POST'};
      broker.subscribe('my-event', sub1).should.equal(400);
    });

    it('should return 400 when subscriber\'s method is missing', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path'};
      broker.subscribe('my-event', sub1).should.equal(400);
    });

    it('should return 400 when subscriber\'s method is invalid', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'STOP'};
      broker.subscribe('my-event', sub1).should.equal(400);
    });

    it('should return 400 when subscriber\'s roundRobin flag is missing', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path'};
      broker.subscribe('my-event', sub1).should.equal(400);
    });
  });

  describe('unsubscribing', function() {

    it.skip('should return 200 when everything is ok', function() {
    });
  });

  describe('resubscribing', function() {

    it.skip('should return 200 when everything is ok', function() {
    });
  });
});
