var assert = require('assert')
  , should = require('should')
  , broker = require('../rest/broker.js')();

describe('[testBroker.js] Broker:', function() {

  beforeEach(function() {
    broker.clear();
  });

  describe('publishing', function() {

    it('should forward event to subscriber', function(done) {
      var sub = {hostname:'localhost',port:4444,path:'path',method:'POST',roundRobin:false};
      broker.subscribe('my-event', sub);

      broker.publish('my-event', 'some data', {
        request: function(actualSub) {
          actualSub.should.equal(sub);
          return {
            end: function() {
              done();
            }
          }
        }
      });
    });

    it('should forward event to multiple subscribers', function(done) {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST',roundRobin:false};
      var sub2 = {hostname:'localhost',port:8888,path:'path',method:'GET',roundRobin:false};
      broker.subscribe('my-event', sub1);
      broker.subscribe('my-event', sub2);

      broker.publish('my-event', 'some data', {
        request: function(currentSub) {
          currentSub.should.equal(sub1);
          return {
            end: function() {
              if(sub1 === sub2) done();
              sub1 = sub2;
            }
          }
        }
      });
    });

    it('should forward event to multiple subscribers using round-robin', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST',roundRobin:true};
      var sub2 = {hostname:'localhost',port:8888,path:'path',method:'GET',roundRobin:true};
      var sub3 = {hostname:'localhost',port:1212,path:'path',method:'GET',roundRobin:true};
      broker.subscribe('my-event', sub1);
      broker.subscribe('my-event', sub2);
      broker.subscribe('my-event', sub3);

      broker.publish('my-event', 'some data', {
        request: function(actualSub) {
          actualSub.should.equal(sub1);
          return {end: function() {}}
        }
      });

      broker.publish('my-event', 'some data', {
        request: function(actualSub) {
          actualSub.should.equal(sub2);
          return {end: function() {}}
        }
      });

      broker.publish('my-event', 'some data', {
        request: function(actualSub) {
          actualSub.should.equal(sub3);
          return {
            end: function() {
              done();
            }
          }
        }
      });
    });

    it('should send data to subscriber', function(done) {
      var sub = {hostname:'localhost',port:4444,path:'path',method:'POST',roundRobin:false};
      broker.subscribe('my-event', sub);

      broker.publish('my-event', 'some data', {
        request: function(actualSub) {
          return {
            end: function(data) {
              data.should.equal('some data');
              done();
            }
          }
        }
      });
    });

    it('should skip broken subscriber', function(done) {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST',roundRobin:false};
      var sub2 = {hostname:'localhost',port:8888,path:'path',method:'GET',roundRobin:false};
      broker.subscribe('my-event', sub1);
      broker.subscribe('my-event', sub2);

      broker.publish('my-event', 'some data', {
        request: function(currentSub) {
          if(currentSub === sub1) throw new Error();
          return {
            end: function() {
              currentSub.should.equal(sub2);
              done();
            }
          }
        }
      });
    });

    it('should remove broken subscriber', function(done) {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST',roundRobin:false};
      var sub2 = {hostname:'localhost',port:8888,path:'path',method:'GET',roundRobin:false};
      broker.subscribe('my-event', sub1);
      broker.subscribe('my-event', sub2);

      broker.publish('my-event', 'some data', {
        request: function(currentSub) {
          if(currentSub === sub1) throw new Error();
        }
      });

      broker.publish('my-event', 'some data', {
        request: function(currentSub) {
          currentSub.should.equal(sub2);
          done();
        }
      });
    });
  });

  describe('subscribing', function() {

    it('should return 200 when everything is ok', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST',roundRobin:false};
      broker.subscribe('my-event', sub1).should.equal(200);
    });

    it.skip('should default to round-robin', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST',roundRobin:false};
      broker.subscribe('my-event', sub1);
    });

    it('should return 500 on repeated subscription', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'POST',roundRobin:false};
      broker.subscribe('my-event', sub1);
      broker.subscribe('my-event', sub1).should.equal(500);
    });

    it('should return 400 when subscriber\'s hostname is missing', function() {
      var sub1 = {port:4444,path:'path',method:'POST',roundRobin:false};
      broker.subscribe('my-event', sub1).should.equal(400);
    });

    it('should return 400 when subscriber\'s port is missing', function() {
      var sub1 = {hostname:'localhost',path:'path',method:'POST',roundRobin:false};
      broker.subscribe('my-event', sub1).should.equal(400);
    });

    it('should return 400 when subscriber\'s path is missing', function() {
      var sub1 = {hostname:'localhost',port:4444,method:'POST',roundRobin:false};
      broker.subscribe('my-event', sub1).should.equal(400);
    });

    it('should return 400 when subscriber\'s method is missing', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',roundRobin:false};
      broker.subscribe('my-event', sub1).should.equal(400);
    });

    it('should return 400 when subscriber\'s method is invalid', function() {
      var sub1 = {hostname:'localhost',port:4444,path:'path',method:'STOP',roundRobin:false};
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
