var broker = require('./broker')()
  , monitoring = require('./monitoring');


/**
 * Expose module.
 */
exports.broker = function() { return new BrokowskiRoutes(); }


/**
 * Constructor.
 */
function BrokowskiRoutes() {}


/**
 * Handle publish request.
 */
BrokowskiRoutes.prototype.publish = function(event, data) {
  broker.publish(event, data);
}


/**
 * Handle subscribe request.
 */
BrokowskiRoutes.prototype.subscribe = function(event, data) {
  return broker.subscribe(event, JSON.parse(data));
}


/**
 * Handle resubscribe request.
 */
BrokowskiRoutes.prototype.resubscribe = function(event, data) {
  return broker.resubscribe(event, JSON.parse(data));
}


/**
 * Handle unsubscribe request.
 */
BrokowskiRoutes.prototype.unsubscribe = function(event, data) {
  return broker.unsubscribe(event, JSON.parse(data));
}


/**
 * Handle clear request.
 */
BrokowskiRoutes.prototype.clear = function(check) {
  return broker.clear();
}


/**
 * Handle monitoring request.
 */
BrokowskiRoutes.prototype.monitoring = function(check) {
  return check == 'alive' ? 200 : 404;
}