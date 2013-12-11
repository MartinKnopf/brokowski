brokowski [![Build Status](https://secure.travis-ci.org/Horsed/brokowski.png)](http://travis-ci.org/Horsed/brokowski)
===========

RESTful publisher, subscriber and broker based on [express](http://expressjs.com/)

Brokowski will be available as a middleware for use in [express](http://expressjs.com/)/[connect](http://www.senchalabs.org/connect/) based servers.

## Installation

Node.js >=0.10 is required

Install via npm: ```npm install brokowski```

## Use as a RESTfull HTTP server

Include brokowski in your app:
```
var brokowski = require('brokowski').rest();
```

Start brokowski as a RESTful HTTP server:
```
brokowski.start(6000); // default port is 3000
```

### REST API

Given the brokowskit REST server runs at port 6000:

#### subscribe

* method: POST
* url: ```http://localhost:6000/subscribe/your-event```
* json: ```{subscriber: "http://localhost:12345/your-event", method: "GET" / "POST" / "PUT" / ...}```
* returns 200 if everything is ok
* returns 400 if json incomplete
* returns 500 if subscriber url already subscribed to event

#### publish

* method: POST
* url: ```http://localhost:6000/publish/your-event```
* json: any

#### monitoring

* method: GET
* url: ```http://localhost:6000/monitoring/alive```
* should return ```200```

### example

TBD

## TODO

* REST: decouple subscription mgmt from transport
* brokowski as middleware for use in other node/express servers
* automatic clean up
* subscriber priority?
* instructions for use with forever
* examples
* HTTPS

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/Horsed/brokowski/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
