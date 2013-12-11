var domain = require('domain')
  , _ = require('lodash')
  , request = require('request');

function PubSub(req) {
  this.subscriptions = {};
  this.request = req;
}

PubSub.prototype.publish = function(req, res) {
  var d = domain.create()
    , self = this;
  
  this.runInDomain(d, req, res, function() {
    var event = req.params['event']
      , data = req.body;

    if(self.subscriptions[event]) {
      for(var i = 0, len = self.subscriptions[event].length; i < len; i++) {
        var sub = self.subscriptions[event][i];
        try {
          self.request[sub.method.toLowerCase()]({url: sub.subscriber, json: data});
        } catch(err) { /* ignore this subscriber and go on to the next */ }
      }
    }

    res.send(200);
  });
};

PubSub.prototype.subscribe = function(req, res) {
  var d = domain.create()
    , self = this;
  
  this.runInDomain(d, req, res, function() {
    var event = req.params['event']
      , sub = {subscriber: req.body.subscriber, method: req.body.method};

    if(sub.subscriber && sub.method && self.isValidHttpMethod(sub.method)) {
      if(self.notYetSubscribed(event, sub)) {
        if(self.subscriptions[event]) self.subscriptions[event].push(sub);
        else self.subscriptions[event] = [sub];
        res.send(200);
      } else {
        res.send(500);
      }
    } else {
      res.send(400);
    }
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