brokowski [![Build Status](https://secure.travis-ci.org/Horsed/brokowski.png)](http://travis-ci.org/Horsed/brokowski)
===========
 
Brokered RESTful publish/subscribe: Broker, publisher and subscriber talking via RESTful interfaces.

Brokowski has a RESTful pub/sub broker, which runs as a HTTP server. It receives subscriptions and events via a RESTful API. The events will be forwarded to the connected subscriber services.
Brokowski also includes publisher and subcriber modules, which offer simple APIs for event handling. They take care of setting up HTTP servers, connecting to the broker and sending/receiving events via the broker's RESTful API, making it easy to include pub/sub event handling into your apps. But since the broker runs on HTTP you can connect your own services via HTTP, too.

broker.js:
```js
var brokowski = require('brokowski').broker().start(6000); // runs at http://192.168.0.1:6000
```

subscriber.js:
```js
var sub = require('brokowski').sub().start(6002, 'mysubscriber', 'http://192.168.0.1:6000'); // runs at http://192.168.0.2:6002

sub.get('my-event', function(data) {
  if(data.coolstuff)
    console.log('get my-event');
});

sub.post('my-event', function(data) {
  if(data.coolstuff)
    console.log('post my-event');
});

sub.put('my-event', function(data) {
  if(data.coolstuff)
    console.log('put my-event');
});

sub.delete('my-event', function(data) {
  if(data.coolstuff)
    console.log('delete my-event');
});
```

publisher.js:
```js
var pub = require('brokowski').pub('http://192.168.0.1:6000'); // publishes to http://192.168.0.1:6000
pub.send('my-event', {coolstuff: true});
```

## Installation

  Node.js >=0.10 is required

    $ npm install brokowski

## RESTful API of the broker

  Given the brokowski broker runs at port 6000:

### subscribe

  * method: POST
  * url: ```http://localhost:6000/subscribe/your-event```
  * json: ```{subscriber: "http://localhost:12345/your-event", method: "GET" / "POST" / "PUT" / ...}```
  * returns 200 if everything is ok
  * returns 400 if json incomplete
  * returns 500 if subscriber url already subscribed to event

### publish

  * method: POST
  * url: ```http://localhost:6000/publish/your-event```
  * json: any

### monitoring

  * method: GET
  * url: ```http://localhost:6000/monitoring/alive```
  * should return ```200```

## TODO

  * REST: decouple subscription mgmt from transport
  * brokowski as middleware for use in other node/express servers?
  * automatic clean up
  * subscriber priority?
  * instructions for use with forever
  * HTTPS
  * broker config options
  * message qeueing?
  * use eventemitter in broker
  * unsubscribing
  * subscribing should fail when not receiving 200
  * does the example cause a memory leak?

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/Horsed/brokowski/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
