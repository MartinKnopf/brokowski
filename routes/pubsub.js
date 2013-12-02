var request = require('request')
  , subscriptions = {}
  , domain = require('domain');

exports.index = function(req, res) {
  res.send(subscriptions);
};

exports.publish = function(req, res) {  
  var event = req.params['event']
    , data = req.body;

  try {
    if(subscriptions[event]) {
      for(var i = 0, len = subscriptions[event].length; i < len; i++) {
        request.post({url: subscriptions[event][i], json: data});
      }
    }

    res.send('publishing event \'' + event + '\' with data ' + data);
  } catch(err) {
    res.send(500, err);
  }
};

exports.suscribe = function(req, res) {
  var event = req.params['event']
    , url = req.body.subscriber;

  if(url) {
    if(subscriptions[event]) subscriptions[event].push(url);
    else subscriptions[event] = [url];
    res.send('subscribing to event \'' + event + '\' with url \'' + url);
  } else {
    res.send(405);
  }
};