var http = require('http')
  , domain = require('domain')
  , _ = require('lodash')
  , rr = require('./rr');


module.exports = function() {
  return new Brokowski();
};


function Brokowski() {
  this.clear();
}


Brokowski.prototype.clear = function() {
  this.subscriptions = {};
};


Brokowski.prototype.publish = function(event, data) {
  this.subscriptions[event] = _.filter(this.subscriptions[event], function(sub) {
    try {
      sub.send(data);
      return true;
    } catch(e) {
      return false;
    }
  });
};


Brokowski.prototype.subscribe = function(event, sub) {
  if(!this.isValid(sub)) return 400;

  this.subscriptions[event] = this.subscriptions[event] || {};

  if(this.subscriptions[event][hash(sub)]) {
    return 500;
  }

  sub.send = function(data) { http.request(sub).end(data); };

  this.subscriptions[event][hash(sub)] = sub;

  return 200;
};


function hash(sub) {
  return sub.hostname + sub.port + sub.path;
}


Brokowski.prototype.resubscribe = function(event, sub) {
  this.unsubscribe(event, sub);
  this.subscribe(event, sub);
};


Brokowski.prototype.unsubscribe = function(event, sub) {
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
            && sub.path;
  } else {
    return false;
  }
};

function printableSub(sub) {
  return sub.hostname + ':' + sub.port + sub.path;
}