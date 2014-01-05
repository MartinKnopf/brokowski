var brokowskiServer = require('./brokowskiServer').broker()
  , cluster = require('cluster')
  , numCPUs = require('os').cpus().length;


/**
 * Expose module.
 */
exports.broker = function() { return new BrokowskiCluster(); }


/**
 * Constructor.
 */
function BrokowskiCluster() {}


/**
 * Start HTTP server.
 */
BrokowskiCluster.prototype.start = function(port) {
  if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", function(worker, code, signal) {
      cluster.fork();
    });
  } else {
    brokowskiServer.start(port);
  }
}