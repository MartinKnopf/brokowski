var http = require('http')
  , url = require('url')
  , broker = require('./brokowskiRoutes')();


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
    try {
     self[req.method](req, res);
    } catch(e) {
      console.log(e);
      res.statusCode = 500;
      res.end();
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
 * Handle GET request.
 */
BrokowskiServer.prototype.GET = function(req, res) {
  var uri = url.parse(req.url).pathname.split('/');
  res.statusCode = this[uri[1]](uri[2]); // this.monitoring('alive');
  res.end();
}