function RestBrokowski() {
  this.express = require('express');
  this.routes = require('./broker')(require('request'));
  this.monitoring = require('./monitoring');
  this.http = require('http');
  this.path = require('path');
  this.app = this.express();
  var self = this;

  this.app.configure(function(){
    self.app.use(self.express.bodyParser());
    self.app.use(self.express.methodOverride());
    self.app.use(self.app.router);
    self.app.use(self.express.static(self.path.join(__dirname, 'public')));
  });

  this.app.configure('development', function(){
    self.app.use(self.express.errorHandler());
  });

  this.app.post('/publish/:event', function(req, res) {self.routes.publish(req, res);});
  this.app.post('/subscribe/:event', function(req, res) {self.routes.subscribe(req, res);});
  this.app.get('/monitoring/:check', this.monitoring.check);
};

RestBrokowski.prototype.start = function(port) {
  this.app.set('port', port || 3000);
  var self = this;
  this.restServer = this.http.createServer(this.app).listen(this.app.get('port'), function() {
    console.log("brokowski broker listening on port " + self.app.get('port'));
  });
  return this;
}

RestBrokowski.prototype.close = function() {
  this.restServer.close();
  return this;
}

exports.broker = function() {
  return new RestBrokowski();
}