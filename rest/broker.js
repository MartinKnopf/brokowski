var http = require('http')
  , domain = require('domain')
  , _ = require('lodash')
  , rr = require('./rr');


module.exports = function() {
  return new Brokowski();
};


function Brokowski() {
  this.roundRobinSubscriptions = {};
  this.loopSubscriptions = {};
}


Brokowski.prototype.publish = function(event, data, httpMock) {
  http = httpMock || http; // for testing

  if(this.loopSubscriptions[event]) this.publishInLoop(event, data, httpMock);

  if(this.roundRobinSubscriptions[event]) this.publishInRoundRobin(event, data, httpMock);
};


Brokowski.prototype.publishInLoop = function(event, data, httpMock) {
  http = httpMock || http; // for testing

  var toRemove = []
    , self = this;

  for(var i = 0, len = this.loopSubscriptions[event].length; i < len; i++) {
    var d = domain.create();
    d.on('error', function(er) {
      toRemove.push(i);
    });

    d.add(event);
    d.add(data);

    d.run(function() {
      try {
        var forward = http.request(self.loopSubscriptions[event][i]);
        forward.end(data);
      } catch(e) {} // try-catch for unit test
    });
  }

  for(var j = 0, len = toRemove.length; j < len; j++) {
    console.log('removing subscriber ' + this.loopSubscriptions[event][toRemove[j]] + ' of ' + event);
    this.loopSubscriptions[event].splice(toRemove[j], 1);
  }
};


Brokowski.prototype.publishInRoundRobin = function(event, data, httpMock) {
  http = httpMock || http; // for testing

  var d = domain.create()
    , self = this
    , sub = rr(this.roundRobinSubscriptions[event]);

  d.on('error', function(er) {
    rr.spliceCurrent(self.roundRobinSubscriptions[event], 1);
    self.unsubscribe(event, sub);

    sub = rr(self.roundRobinSubscriptions[event]);
    try {
      var forward = http.request(sub);
      forward.end(data);
    } catch(e) {
    } // try-catch for unit test
  });

  d.add(event);
  d.add(data);

  d.run(function() {
    try {
      var forward = http.request(sub);
      forward.end(data);
    } catch(e) {
    } // try-catch for unit test
  });
};


Brokowski.prototype.subscribe = function(event, sub) {
  if(!this.isValid(sub)) return 400;

  var subscriptions = sub.roundRobin === true
    ? this.roundRobinSubscriptions
    /*? this.loopSubscriptions*/
    : this.loopSubscriptions;

  if(subscriptions[event]) {
    if(this.notYetSubscribed(event, sub, subscriptions)) {
      subscriptions[event].push(sub);
    } else {
      return 500;
    }
  } else {
    subscriptions[event] = [sub];
  }

  return 200;
};


Brokowski.prototype.resubscribe = function(event, sub) {
  this.unsubscribe(event, sub);
  this.subscribe(event, sub);
};


Brokowski.prototype.unsubscribe = function(event, sub) {
  _.filter(this.loopSubscriptions[event], sub);
};


Brokowski.prototype.notYetSubscribed = function(event, subscriber, subscriptions) {
  return _.isEmpty(_.filter(subscriptions[event], subscriber));
};


Brokowski.prototype.isValid = function(sub) {
  if(sub.method) {
    var method = sub.method.toLowerCase();
    return (method == 'get' || method == 'post' || method == 'put' || method == 'delete')
            && sub.hostname
            && sub.port
            && sub.path
            && (sub.roundRobin === true || sub.roundRobin === false);
  } else {
    return false;
  }
};


Brokowski.prototype.clear = function() {
  this.roundRobinSubscriptions = {};
  this.loopSubscriptions = {};
};