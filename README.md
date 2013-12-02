# RESTful pub/sub server
This is a Node.js based RESTful publish/subscribe eventbus.
[![Build Status](https://secure.travis-ci.org/horsed/repusu.png)](http://travis-ci.org/horsed/repusu)

## Installation
1. Download this repo as a zip or clone it.
2. run ```npm install```
3. start via ```node app.js```

## API
Given the server runs at ```http://localhost:3000```:

* **subscribe**: POST ```{subscriber: 'http://localhost:12345/event'}``` to ```http://localhost:3000/subscribe/:event```
* **publish**: POST any JSON to ```http://localhost:3000/publish/:event```
* **monitoring**: GET ```http:localhost:3000/monitoring/alive``` returns ```200```

## TODO
* hardening

## LICENSE
Copyright 2013 Martin Knopf

Licensed under the MIT License