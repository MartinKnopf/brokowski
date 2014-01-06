/**
 * Expose module.
 */
exports.pub = function(options) {
  return new Publisher(options);
}


/**
 * Constructor.
 * 
 * options: {
 *   broker: 'http://192.168.0.101:4444' // mandatory
 * }
 */
function Publisher(options) {
  this.request = require('request');
  this.util = require('./util');

  if(!options.broker) throw new Error('No broker provided to publisher');

  this.options = require('node.extend')({}, options);

  var self = this;
};


Publisher.prototype.send = function(event, data) {
  this.request.post({url: this.util.normalizeBrokerUrl(this.options.broker) + 'publish/' + event, json: data});
  return this;
};