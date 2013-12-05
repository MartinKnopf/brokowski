var request
  , subscriptions = {};

module.exports = function(req) {
  request = req;

  return {
    publish: function(req, res) {  
      var event = req.params['event']
        , data = req.body;

      if(subscriptions[event]) {
        for(var i = 0, len = subscriptions[event].length; i < len; i++) {
          var sub = subscriptions[event][i];
          try {
            request[sub.method.toLowerCase()]({url: sub.subscriber, json: data});
          } catch(err) { /* ignore this subscriber and go on */ }
        }
      }

      res.send(200);
    },
    subscribe: function(req, res) {
      var event = req.params['event']
        , url = req.body.subscriber
        , method = req.body.method;

      if(url) {
        if(subscriptions[event]) subscriptions[event].push({subscriber: url, method: method});
        else subscriptions[event] = [{subscriber: url, method: method}];
        res.send(200);
      } else {
        res.send(405);
      }
    }    
  }
};
