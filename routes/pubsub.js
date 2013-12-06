var request
  , domain = require('domain')
  , _ = require('lodash')
  , subscriptions = {};

module.exports = function(req) {
  request = req;

  return {
    publish: function(req, res) {
      var d = domain.create();
      runInDomain(d, req, res, function() {
        var event = req.params['event']
          , data = req.body;

        if(subscriptions[event]) {
          for(var i = 0, len = subscriptions[event].length; i < len; i++) {
            var sub = subscriptions[event][i];
            try {
              request[sub.method.toLowerCase()]({url: sub.subscriber, json: data});
            } catch(err) { /* ignore this subscriber and go on to the next */ }
          }
        }

        res.send(200);
      });
    },
    subscribe: function(req, res) {
      var d = domain.create();
      runInDomain(d, req, res, function() {
        var event = req.params['event']
          , sub = {subscriber: req.body.subscriber, method: req.body.method};

        if(sub.subscriber && sub.method && isValidHttpMethod(sub.method)) {
          if(notYetSubscribed(event, sub)) {
            if(subscriptions[event]) subscriptions[event].push(sub);
            else subscriptions[event] = [sub];
            res.send(200);
          } else {
            res.send(500);
          }
        } else {
          res.send(400);
        }
      });
    },
    clear: function() {
      subscriptions = {};
    }
  }
};

function runInDomain(d, req, res, f) {
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

function isValidHttpMethod(method) {
  method = method.toLowerCase();
  return request[method];
}

function notYetSubscribed(event, subscriber) {
  return _.isEmpty(_.filter(subscriptions[event], function(subscription) {
    return _.isEqual(subscription, subscriber);
  }));
}