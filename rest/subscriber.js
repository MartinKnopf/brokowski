var request = require('request')
  , util = require('./util')
  , http = require('http')
  , express = require('express')
  , path = require('path');

function SubscriberServer() {
  this.monitoring = require('./monitoring');
};

SubscriberServer.prototype.start = function(port, name, broker) {
  this.port = port;
  this.name = name;
  this.broker = broker;
  var self = this;

  // configure server
  this.app = express();
  this.app.set('port', this.port || 3000);
  this.app.configure(function(){
    self.app.use(express.logger('dev'));
    self.app.use(express.bodyParser());
    self.app.use(express.methodOverride());
    self.app.use(self.app.router);
    self.app.use(express.static(path.join(__dirname, 'public')));
  });
  this.app.configure('development', function(){
    self.app.use(express.errorHandler());
  });

  // event handlers
  this.getHandlers = {};
  this.postHandlers = {};
  this.putHandlers = {};
  this.deleteHandlers = {};

  // configure event handling routes
  this.app.get('/' + this.name + '/:event', function(req, res) {
    res.end();
    if(self.getHandlers[req.params['event']]) self.getHandlers[req.params['event']](req.body);
  });

  this.app.post('/' + this.name + '/:event', function(req, res) {
    res.send(200);
    res.end();
    if(self.postHandlers[req.params['event']]) self.postHandlers[req.params['event']](req.body);
  });

  this.app.put('/' + this.name + '/:event', function(req, res) {
    res.send(200);
    res.end();
    if(self.putHandlers[req.params['event']]) self.putHandlers[req.params['event']](req.body);
  });

  this.app.delete('/' + this.name + '/:event', function(req, res) {
    res.send(200);
    res.end();
    if(self.deleteHandlers[req.params['event']]) self.deleteHandlers[req.params['event']](req.body);
  });

  this.app.get('/monitoring/:check', this.monitoring.check);

  // run server
  this.restServer = http.createServer(this.app).listen(this.app.get('port'), function() {
    console.log('subscriber server \'' + self.name + '\' listening on port ' + self.app.get('port'));
  });
  return this;
}

SubscriberServer.prototype.close = function() {
  this.restServer.close();
  return this;
}

SubscriberServer.prototype.get = function(event, handler) {
  this.subscribe(event, 'GET');
  this.getHandlers[event] = handler;
  return this;
}

SubscriberServer.prototype.post = function(event, handler) {
  this.subscribe(event, 'POST');
  this.postHandlers[event] = handler;
  return this;
}

SubscriberServer.prototype.put = function(event, handler) {
  this.subscribe(event, 'PUT');
  this.putHandlers[event] = handler;
  return this;
}

SubscriberServer.prototype.delete = function(event, handler) {
  this.subscribe(event, 'DELETE');
  this.deleteHandlers[event] = handler;
  return this;
}

SubscriberServer.prototype.subscribe = function(event, method) {
  request.post({
    url: util.normalizeBrokerUrl(this.broker) + 'subscribe/' + event,
    json: {
      subscriber: 'http://localhost:' + this.app.get('port') + '/' + this.name + '/' + event,
      method: method
    }
  });
}

exports.sub = function(port, name, broker) {
  return new SubscriberServer(port, name, broker);
}