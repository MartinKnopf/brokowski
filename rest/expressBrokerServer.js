/*require('nodetime').profile({
  accountKey: '5a1b28e0720e290c7c97da7c4828eea9f4b85a7b', 
  appName: 'Node.js Application'
});*/

function RestBrokowski() {
  this.express = require('express');
  this.broker = require('./broker')();
  this.monitoring = require('./monitoring');
  this.http = require('http');
  this.app = this.express();
  var self = this;

  this.app.configure(function(){
    self.app.use(self.app.router);
  });

  this.app.configure('development', function(){
    self.app.use(self.express.errorHandler());
  });

  this.app.post('/publish/:event', function(req, res) {
    var data='';

    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
      data += chunk;
    });
    req.on('end', function() {
      res.end();
      self.broker.publish(req.params['event'], data);
    });
  });

  this.app.post('/subscribe/:event', function(req, res) {
    var data='';

    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
      data += chunk;
    });
    req.on('end', function() {
      res.end();
      self.broker.subscribe(req.params['event'], JSON.parse(data));
    });
  });    

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