var express = require('express')
  , routes = require('./routes/pubsub')(require('request'))
  , monitoring = require('./routes/monitoring')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.post('/publish/:event', routes.publish);
app.post('/subscribe/:event', routes.subscribe);
app.get('/monitoring/:check', monitoring.check);

module.exports = http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});