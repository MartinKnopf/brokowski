var assert = require('assert')
  , should = require('should')
  , _ = require('lodash')
  , http = require('http')
  , broker = require('../lib/broker.js')();

function HttpMock(onEnd) {
  this.onEnd = onEnd;
  this.notifiedSubs = [];
}
HttpMock.prototype.request = function(actualSub) {
  this.actualSub = actualSub;
  this.notifiedSubs.push(actualSub);
  return this;
}
HttpMock.prototype.on = function(event, cb) {
  return this;
}
HttpMock.prototype.end = function(actualData) {
  if(this.onEnd) this.onEnd(this.actualSub, actualData);
  return this;
}
HttpMock.prototype.getNotifiedSubs = function() {
  return this.notifiedSubs;
}

describe('[testBroker.js] Broker:', function() {

  beforeEach(function() {
    broker.clear();
  });

  describe('publishing', function() {

    it('should forward event to subscriber', function(done) {
      var sub = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      broker.subscribe('my-event', sub);

      broker.publish('my-event', 'some data', new HttpMock(function(actualSub) {
        actualSub.should.equal(sub);
        done();
      }));
    });

    it('should not forward event to subscriber of other event', function(done) {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      var sub2 = {hostname:'localhost',port:8888,path:'path',method:'GET'};
      broker.subscribe('my-event', sub1);
      broker.subscribe('my-other-event', sub2);

      broker.publish('my-event', 'some data', new HttpMock(function(actualSub) {
        actualSub.should.equal(sub1);
        done();
      }));
    });

    it('should forward event to multiple subscribers', function(done) {
      broker.subscribe('my-event', {hostname:'localhost',port:4444,path:'path',method:'POST'});
      broker.subscribe('my-event', {hostname:'localhost',port:8888,path:'path',method:'POST'});

      var subs = [];

      broker.publish('my-event', 'some data', new HttpMock(function(actualSub) {
        subs.push(actualSub);
        if(subs.length === 2) done();
      }));
    });

    it('should send data to subscriber', function(done) {
      broker.subscribe('my-event', {hostname:'localhost',port:4444,path:'path',method:'POST'});

      broker.publish('my-event', 'some data', new HttpMock(function(actualSub, actualData) {
        actualData.should.equal('some data');
        done();
      }));
    });

    it('should not fail after erroneous subscriber', function(done) {
      var sub1 = {hostname:'brokenhost',port:4444,path:'path',method:'POST'};
      var sub2 = {hostname:'localhost',port:8888,path:'path',method:'GET'};
      broker.subscribe('my-event', sub1);
      broker.subscribe('my-event', sub2);

      var subs = [];

      broker.publish('my-event', 'some data', new HttpMock(function(actualSub) {
        subs.push(actualSub);
        if(_.isEqual(actualSub, sub1)) throw new Error();
        else if(subs.length === 2) done();
      }));
    });

    it('should remove erroneous subscriber', function() {
      var sub1 = {hostname:'brokenhost',port:4444,path:'path',method:'POST'};
      var sub2 = {hostname:'localhost',port:8888,path:'path',method:'GET'};
      broker.subscribe('my-event', sub1);
      broker.subscribe('my-event', sub2);

      broker.publish('my-event', 'some data', new HttpMock(function(actualSub) {
        if(_.isEqual(actualSub, sub1)) throw new Error();
      }));

      var httpMock = new HttpMock();
      broker.publish('my-event', 'some data', httpMock);

      httpMock.getNotifiedSubs().length.should.equal(1);
    });

    it('should clear subscriptions', function() {
      var sub1 = {hostname:'localhost',port:8888,path:'path',method:'GET'};
      broker.subscribe('my-event', sub1);

      broker.clear();

      var httpMock = new HttpMock();
      broker.publish('my-event', 'some data', httpMock);

      httpMock.getNotifiedSubs().length.should.equal(0);
    });
  });

  describe('subscribing', function() {

    it('should return 200 when everything is ok', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      broker.subscribe('my-event', sub1).should.equal(200);
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
  });

  describe('unsubscribing', function() {

    it('should return 200 when everything is ok', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      broker.subscribe('my-event', sub1);
      broker.unsubscribe('my-event', sub1).should.equal(200);
    });

    it('should not notify unsubscribed subscriber again', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      broker.subscribe('my-event', sub1);
      broker.unsubscribe('my-event', sub1);

      var httpMock = new HttpMock();
      broker.publish('my-event', 'some data', httpMock);

      httpMock.getNotifiedSubs().length.should.equal(0);
    });
  });

  describe('resubscribing', function() {

    it('should return 200 when subscriber is already registerd', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      broker.subscribe('my-event', sub1);

      broker.resubscribe('my-event', sub1).should.equal(200);
    });

    it('should notify resubscribed subscriber only once', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST'};
      broker.subscribe('my-event', sub1);
      broker.resubscribe('my-event', sub1);

      var httpMock = new HttpMock();
      broker.publish('my-event', 'some data', httpMock);

      httpMock.getNotifiedSubs().length.should.equal(1);
    });
  });
});
