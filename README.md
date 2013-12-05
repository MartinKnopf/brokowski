brokowski
===========

Node.js based RESTful publish/subscribe broker.

[![Build Status](https://secure.travis-ci.org/Horsed/brokowski.png)](http://travis-ci.org/Horsed/brokowski) v 0.0.1

A subscriber tells the eventbus which event it wants to subscribe to and which REST method the eventbus should call when that event is triggerd.

## Installation
1. Download this repo as a zip or clone it.
2. run ```npm install```
3. start via ```node app.js```

## Dependencies
Node.js >=0.10

## REST API
Given the server runs at ```http://localhost:3000```:

### subscribe
method: POST
url: ```http://localhost:3000/subscribe/your-event```
json: ```{subscriber: "http://localhost:12345/your-event", method: "GET"}```

### publish
method: POST
url: ```http://localhost:3000/publish/your-event```
json: any

### monitoring
method: GET
url: ```http:localhost:3000/monitoring/alive```
should return ```200```

## TODO
* hardening
* automatic clean up
* publish to subscribers with the specified HTTP method