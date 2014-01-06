exports.brokowskiServer = function(options) {
  return require('./lib/brokowskiServer').broker(options);
}
exports.brokowskiCluster = function(options) {
  return require('./lib/brokowskiCluster').broker(options);
}
exports.pub = function(options) {
  return require('./lib/publisher').pub(options);
}
exports.sub = function(options) {
  return require('./lib/subscriber').sub(options);
}