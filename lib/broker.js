var util = require('util')
  , http = require('http')
  , domain = require('domain')
  , _ = require('lodash')
  , EventEmitter = require('eventemitter2').EventEmitter2;


util.inherits(Brokowski, EventEmitter); // what about maxListeners??????????


module.exports = function() {
  return new Brokowski();
};


function Brokowski() {
  this.events = {};
  this.subscriptions = {};
}


Brokowski.prototype.clear = function() {
  this.subscriptions = {};
  this.removeAllListeners();
};


Brokowski.prototype.publish = function(event, data, httpMock) {
  this.emit(event, data, httpMock || http);
};


Brokowski.prototype.subscribe = function(event, sub) {
  if(!isValid(sub)) return 400;

  this.subscriptions[event] = this.subscriptions[event] || {};

  if(isSubscribed(event, sub, this.subscriptions)) return 500;

  var self = this
    , send = function(data, http) {
    try {
      if(self.subscriptions[event][hash(sub)]) {
        http.request(sub)
          .on('error', function(err) {
            self.unsubscribe(event, sub);
          })
          .end(data);
      } else {
        self.unsubscribe(event, sub);
      }
    } catch(e) {
      self.unsubscribe(event, sub);
    }
  };

  this.on(event, send);
  
  sub.send = send;

  this.subscriptions[event][hash(sub)] = sub;

  return 200;
};


Brokowski.prototype.resubscribe = function(event, sub) {
  this.unsubscribe(event, sub);
  return this.subscribe(event, sub);
};


Brokowski.prototype.unsubscribe = function(event, sub) {
  if(this.subscriptions[event]) {
    if(this.subscriptions[event][hash(sub)]) {
      this.removeListener(event, this.subscriptions[event][hash(sub)].send);
      delete this.subscriptions[event][hash(sub)];
      return 200;
    }
  }
  return 500;
};


function isValid(sub) {
  if(sub.method) {
    var method = sub.method.toLowerCase();
    return (method == 'get' || method == 'post' || method == 'put' || method == 'delete')
            && sub.hostname
            && sub.port
            && sub.path;
  } else {
    return false;
  }
};


function hash(sub) {
  return sub.method + sub.hostname + sub.port + sub.path;
}


function isSubscribed(event, subscriber, subscriptions) {
  return !_.isEmpty(_.filter(subscriptions[event], subscriber));
};