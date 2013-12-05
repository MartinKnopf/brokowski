RESTful pub/sub server
===========

Lightweight Node.js based RESTful publish/subscribe broker.

[![Build Status](https://secure.travis-ci.org/Horsed/brokowski.png)](http://travis-ci.org/Horsed/brokowski)

A subscriber tells the eventbus which event it wants to subscribe to and which REST method the eventbus should call when that event is triggerd.

## Installation
1. Download this repo as a zip or clone it.
2. run ```npm install```
3. start via ```node app.js```

## Dependencies
Node.js ~0.10

## REST API
Given the server runs at ```http://localhost:3000```:

### subscribe
POST ```{subscriber: "http://localhost:12345/event", method: "POST"}``` to ```http://localhost:3000/subscribe/:event```

### publish
POST any JSON to ```http://localhost:3000/publish/:event```

### monitoring
GET ```http:localhost:3000/monitoring/alive``` returns ```200```

## TODO
* hardening
* automatic clean up