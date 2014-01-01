exports.brokowskiServer = function() {
  return require('./rest/brokowskiServer').broker();
}
exports.brokowskiCluster = function() {
  return require('./rest/brokowskiCluster').broker();
}
exports.pub = function(broker) {
  return require('./rest/publisher').pub(broker);
}
exports.sub = function() {
  return require('./rest/subscriber').sub();
}