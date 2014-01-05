var util = require('util')
  , http = require('http')
  , domain = require('domain')
  , _ = require('lodash')
  , EventEmitter = require('events').EventEmitter;


util.inherits(Brokowski, EventEmitter); // what about maxListeners??????????


module.exports = function() {
  return new Brokowski();
};


function Brokowski() {
  this.clear();
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

  this.subscriptions[event][hash(sub)] = sub;

  this.on(event, function(data, http) {
    http.request(sub)
      .on('error', function(err) {})
      .end(data);
  });

  return 200;
};


Brokowski.prototype.resubscribe = function(event, sub) {
  this.unsubscribe(event, sub);
  return this.subscribe(event, sub);
};


Brokowski.prototype.unsubscribe = function(event, sub) {
  if(this.subscriptions[event]) {
    if(this.subscriptions[event][hash(sub)]) {
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