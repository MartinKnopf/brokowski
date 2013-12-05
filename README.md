brokowski
===========

Node.js based RESTful publish/subscribe broker.

[![Build Status](https://secure.travis-ci.org/Horsed/brokowski.png)](http://travis-ci.org/Horsed/brokowski) v 0.0.1

A subscriber tells the eventbus which event it wants to subscribe to and which REST method the eventbus should call when that event is triggerd.

## Installation
Node.js >=0.10 is required

1. installing: ```npm install brokowski```
2. running: ```node node_modules/brokowski/brokowski```

## REST API
Given the brokowski server runs at ```http://localhost:3000```:

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
* url: ```http:localhost:3000/monitoring/alive```
* should return ```200```

## TODO
* automatic clean up
* subscriber priority?