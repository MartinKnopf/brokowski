var cluster = require('cluster')
  , numCPUs = require('os').cpus().length
  , BrokowskiServer = require('./brokowskiServer')
  , brokowskiServer = require('./brokowskiServer');


module.exports = BrokowskiCluster;


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
function BrokowskiCluster(options) {
  this.options = require('node.extend')({}, options);

  if(this.options.subscribers) {
    for(var i = 0, len = this.options.subscribers.length; i < len; i++) {
      routes.subscribe(this.options.subscribers[i].event, this.options.subscribers[i]);
    }
  }
}


/**
 * Start HTTP server.
 */
BrokowskiCluster.prototype.start = function() {
  brokowskiServer = new BrokowskiServer(this.options);

  if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", function(worker, code, signal) {
      cluster.fork();
    });
  } else {
    brokowskiServer.start();
  }
}