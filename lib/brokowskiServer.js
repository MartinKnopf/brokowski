var http = require('http')
  , url = require('url')
  , routes = require('./brokowskiRoutes').routes();


/**
 * Expose module.
 */
exports.broker = function(options) { return new BrokowskiServer(options); }


/**
 * Constructor.
 * 
 * options: {
 *   port: 6000,
 *   subscribers: [{
 *    event: 'my-event',
 *    method: 'GET',
 *    hostname: '192.168.0.100',
 *    port: 6002,
 *    path: 'my-service'
 *  }]
 * }
 */
function BrokowskiServer(options) {
  this.options = require('node.extend')({}, options);

  if(this.options.subscribers) {
    for(var i = 0, len = this.options.subscribers.length; i < len; i++) {
      routes.subscribe(this.options.subscribers[i].event, this.options.subscribers[i]);
    }
  }
}


/**
 * Starts the HTTP server.
 */
BrokowskiServer.prototype.start = function() {
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

  this.server.listen(this.port || 3000, function() {
    console.log('starting brokowski server ' + JSON.stringify({pid: process.pid, port: this.port || 3000}));
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
    // routes.publish('event-name', data) or routes.subscribe('event-name', data)
    res.statusCode = routes[uri[1]](uri[2], data) || 200;
    res.end();
  });
}


/**
 * Handle GET request.
 */
BrokowskiServer.prototype.GET = function(req, res) {
  var uri = url.parse(req.url).pathname.split('/');
  res.statusCode = routes[uri[1]](uri[2]); // routes.monitoring('alive');
  res.end();
}