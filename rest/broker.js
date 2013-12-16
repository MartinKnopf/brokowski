var domain = require('domain')
  , _ = require('lodash')
  , request = require('request')
  , events = require('events')
  , eventEmitter = new events.EventEmitter();

function PubSub(req) {
  this.subscriptions = {};
  this.request = req;
}

PubSub.prototype.publish = function(req, res) {
  res.send(200);
  res.end();
  eventEmitter.emit(req.params['event'], req.body);
};

PubSub.prototype.subscribe = function(req, res) {
  
  // check subscription
  
  res.end();

  var self = this;
  
  eventEmitter.on(req.params['event'], function(data) {
    self.runInDomain(domain.create(), req, res, function() {
      self.request[req.body.method.toLowerCase()]({url: req.body.subscriber, json: data});
    });
  });
};

PubSub.prototype.clear = function() {
  this.subscriptions = {};
};

PubSub.prototype.runInDomain = function(d, req, res, f) {
  d.on('error', function(er) {
    console.error('error', er.stack);
    try {
      res.send(500);
    } catch (er2) {
      console.error('Error sending 500!', er2.stack);
    }
  });

  d.add(req);
  d.add(res);

  d.run(f);
}

PubSub.prototype.isValidHttpMethod = function(method) {
  method = method.toLowerCase();
  return request[method];
}

PubSub.prototype.notYetSubscribed = function(event, subscriber) {
  return _.isEmpty(_.filter(this.subscriptions[event], subscriber));
}

module.exports = function(req) {
  return new PubSub(req);
};