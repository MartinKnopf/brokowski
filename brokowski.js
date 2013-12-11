exports.rest = function() {
  return require('./rest/server').rest();
}

exports.zmq = function() {
  return require('./zmq/xpubXsubProxy').zmq();
}