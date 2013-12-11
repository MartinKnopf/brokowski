function Publisher(broker) {
  this.request = require('request');
  this.util = require('./util');

  this.broker = broker;
  var self = this;
};

Publisher.prototype.send = function(event, data) {
  this.request.post({url: this.util.normalizeBrokerUrl(this.broker) + 'publish/' + event, json: data});
  return this;
}

exports.pub = function(broker) {
  return new Publisher(broker);
}