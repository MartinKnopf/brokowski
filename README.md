brokowski
===========

Standalone publish/subscribe broker. [Zeromq](http://zeromq.org/) API or RESTful API. Also available as a middleware for use in [express](http://expressjs.com/)/[connect](http://www.senchalabs.org/connect/) based servers.

[![Build Status](https://secure.travis-ci.org/Horsed/brokowski.png)](http://travis-ci.org/Horsed/brokowski)

## Installation
Node.js >=0.10 is required

TODO: Installation with zeromq

1. installing: ```npm install brokowski```
2. running: ```node node_modules/brokowski/brokowski```

## Use with Zeromq
Given brokowski is bound to ```tcp://127.0.0.1:3000```:

### subscribe
publish a message:
* address: ```tcp://127.0.0.1:3000```
* topic: ```subscribe```
* msg: ```"{ "subscriber": "tcp://127.0.0.1:12345", "event": "my-event" }"```

### publish
publish a message:
* address: ```tcp://127.0.0.1:3000```
* topic: ```publish```
* msg: ```"{ "event": "my-event", "data": any JSON }"```

### monitoring
TBD (with request/reply?)

### example
TBD

## REST API
Given brokowski runs at ```http://localhost:3000```:

### subscribe
* method: POST
* url: ```http://localhost:3000/subscribe/your-event```
* json: ```{subscriber: "http://localhost:12345/your-event", method: "GET" / "POST" / "PUT" / ...}```

### publish
* method: POST
* url: ```http://localhost:3000/publish/your-event```
* json: any

### monitoring
* method: GET
* url: ```http://localhost:3000/monitoring/alive```
* should return ```200```

### example
TBD

## TODO
* decouple subscription mgmt from transport
* add zeromq
* brokowski as middleware for use in other node/express servers
* automatic clean up
* subscriber priority?
* instructions for use with forever
* examples
* HTTPS

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/Horsed/brokowski/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
