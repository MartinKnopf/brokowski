var http = require('http')
  , toobusy = require('toobusy')
  , url = require('url')
  , broker = require('./broker')()
  , monitoring = require('./monitoring');


/**
 * Expose module.
 */
exports.broker = function() { return new BrokowskiServer(); }


/**
 * Constructor.
 */
function BrokowskiServer() {}


/**
 * Starts the HTTP server.
 */
BrokowskiServer.prototype.start = function(port) {
  var self = this;
  
  this.server = http.createServer(function(req, res) {
    if (toobusy()) {
      res.writeHead(503, 'Server is too busy.');
      res.end();
      return;
    } 

    try {
     self[req.method](req, res);
    } catch(e) {
      console.log(e);
      res.statusCode = 500;
    }
  });

  this.server.listen(port || 3000, function() {
    console.log('starting brokowski server ' + JSON.stringify({pid: process.pid, port: port || 3000}));
  });
}


/**
 * Handle POST request.
 */
BrokowskiServer.prototype.POST = function(req, res) {
  var self = this
    , uri = url.parse(req.url).pathname.split('/')
    , data='';

  req.setEncoding('utf8');

  req.on('data', function(chunk) {
    data += chunk;
  });

  req.on('end', function() {
    // self.publish('event-name', data) or self.subscribe('event-name', data)
    res.statusCode = self[uri[1]](uri[2], data) || 200;
    res.end();
  });
}


/**
 * Handle POST request.
 */
BrokowskiServer.prototype.GET = function(req, res) {
  var uri = url.parse(req.url).pathname.split('/');
  res.statusCode = this[uri[1]](uri[2]); // this.monitoring('alive');
  res.end();
}


/**
 * Handle publish request.
 */
BrokowskiServer.prototype.publish = function(event, data) {
  broker.publish(event, data);
}


/**
 * Handle subscribe request.
 */
BrokowskiServer.prototype.subscribe = function(event, data) {
  return broker.subscribe(event, JSON.parse(data));
}


/**
 * Handle resubscribe request.
 */
BrokowskiServer.prototype.resubscribe = function(event, data) {
  return broker.resubscribe(event, JSON.parse(data));
}


/**
 * Handle unsubscribe request.
 */
BrokowskiServer.prototype.unsubscribe = function(event, data) {
  return broker.unsubscribe(event, JSON.parse(data));
}


/**
 * Handle monitoring request.
 */
BrokowskiServer.prototype.monitoring = function(check) {
  return check == 'alive' ? 200 : 404;
}