brokowski
===========

Standalone publish/subscribe broker. [Zeromq](http://zeromq.org/) based socket or RESTful API. Also available as a middleware for use in [express](http://expressjs.com/)/[connect](http://www.senchalabs.org/connect/) based servers.

[![Build Status](https://secure.travis-ci.org/Horsed/brokowski.png)](http://travis-ci.org/Horsed/brokowski)

## Installation
Node.js >=0.10 is required

TODO: Installation of zeromq

1. installing: ```npm install brokowski```

## Use as a zeromq XPUB/XSUB proxy
1. include in your app: ```var brokowski = require('brokowski').zmq();```
2. start brokowski as a zeromq XPUB/XSUB proxy: ```brokowski.start(/*xsub port*/ 11111, /*xpub port*/ 22222); // default ports are 5000, 5001```

The sockets will be bound to the given **TCP** ports!

### example using [node-zeromq](https://github.com/JustinTulloss/zeromq.node)
#### subscribing
```require('zmq').socket('sub').subscribe('myevent').connect('tcp://127.0.0.1:22222');```

#### publishing
```require('zmq').socket('pub').connect('tcp://127.0.0.1:11111');```

## Use as a RESTfull HTTP server
1. include in your app: ```var brokowski = require('brokowski').rest();```
2. start brokowski as a RESTful HTTP server: ```brokowski.start(6000); // default port is 3000```

### REST API
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
* decouple subscription mgmt from transport
* brokowski as middleware for use in other node/express servers
* automatic clean up
* subscriber priority?
* instructions for use with forever
* examples
* HTTPS

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/Horsed/brokowski/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
