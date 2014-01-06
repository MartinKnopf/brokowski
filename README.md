brokowski [![Build Status](https://secure.travis-ci.org/Horsed/brokowski.png)](http://travis-ci.org/Horsed/brokowski) [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)
===========
 
RESTful publish/subscribe broker (and publisher and subscriber)

Brokowski has a RESTful pub/sub broker, which runs as a HTTP server. It receives subscriptions and events via a RESTful API. The events will be forwarded to the connected subscriber services.
Brokowski also includes publisher and subcriber modules, which offer simple APIs for RESTful event handling. They take care of setting up HTTP servers, connecting to the broker and sending/receiving events via the broker's RESTful API, making it easy to include pub/sub event handling into your apps. And since the broker runs on HTTP you can connect your own services via HTTP, too.

## Installation

  Node.js ~0.10 is required

    $ npm install brokowski

## API

  broker:
  ```js
  // starts one broker at http://192.168.0.1:6000
  var brokowski = require('brokowski').brokowskiServer().start(6000);

  // starts a cluster of brokers at http://192.168.0.1:6000 (one server on each CPU core)
  var brokowski = require('brokowski').brokowskiCluster().start(6000);
  ```

  subscriber:
  ```js
  // starts subscriber at http://192.168.0.2:6002/mysubscriber
  var sub = require('brokowski').sub().start(6002, 'mysubscriber', 'http://192.168.0.1:6000');

  sub
    .get('my-event', function(data) { // resubscribing
      if(data.coolstuff) console.log('GET my-event');
    })
    .post('my-event', function(data) { // resubscribing
      if(data.coolstuff) console.log('POST my-event');
    })
    .put('my-event', function(data) { // resubscribing
      if(data.coolstuff) console.log('PUT my-event');
    })
    .delete('my-event', function(data) { // resubscribing
      if(data.coolstuff) console.log('DELETE my-event');
    })
    .subscribe({
      event: 'my-other-event',
      method: 'GET',             /* or 'POST' or 'PUT' or 'DELETE' */
      hostname: '192.168.0.100', /* default: 'localhost' */
      port: 6000,                /* default: port provided to sub.start() */
      path: 'my-service',        /* default: '/service-name/method/event' */
      handler: function(data) {
        console.log('GET my-other-event');
      }
    });
    .resubscribe({
      event: 'my-other-event',
      method: 'GET',
      handler: function(data) {
        console.log('GET my-other-event');
      }
    });
    .unsubscribe({
      event: 'my-other-event',
      method: 'GET',
      handler: function(data) {
        console.log('GET my-other-event');
      }
    });
  ```

  publisher:
  ```js
  var pub = require('brokowski').pub('http://192.168.0.1:6000');
  pub.send('my-event', {coolstuff: true});
  ```

## RESTful API of the broker

  Subscription parameters:

  ```js
  {
    method: 'GET', /* or 'POST' or 'PUT' or 'DELETE' */
    hostname: '192.168.0.100' ,
    port: 6000,
    path: 'subscriber-path'
  }
  ```

### subscribe

  * method: POST
  * url: ```http://localhost:6000/subscribe/myevent```
  * json: see the parameters
  * returns 200 if everything is ok
  * returns 400 if json is incomplete
  * returns 500 if subscriber was subscribed to event

### resubscribe

  All subscribers matching the given json will be removed before the new subscription.
  * method: POST
  * url: ```http://localhost:6000/resubscribe/myevent```
  * json: see the parameters
  * returns 200 if everything is ok
  * returns 400 if json is incomplete

### unsubscribe

  All subscribers matching the given json will be removed.
  * method: POST
  * url: ```http://localhost:6000/unsubscribe/myevent```
  * json: see the parameters
  * returns 200 if everything is ok
  * returns 500 if subscriber wasn't already subscribed to event

### publish

  * method: POST
  * url: ```http://localhost:6000/publish/myevent```
  * json: any
  * returns 200 if everything is ok

### clear

  Removes all subscriptions.
  * method: GET
  * url: ```http://localhost:6000/clear```
  * should return ```200```

### monitoring

  * method: GET
  * url: ```http://localhost:6000/monitoring/alive```
  * should return ```200```

## Performance (0.1.2)

  For the performance tests I used most of the test code from [node-zmq](https://github.com/JustinTulloss/zeromq.node).

  My machine:

  * Windows 7 64bit
  * AMD Phenom(tm) II X4 955 @ 3.2 GHz
  * 6 GB memory
  * 100 Mbit LAN

### Tests with single subscriber:

|                 | **10.000  messages**                | **100.000 messages** |
| --------------: |:-----------------------------------:| :-------------------:|
|      **2 Byte** | 3951 [msg/s]                        | 4027 [msg/s]         |
|     **64 Byte** | 3841 [msg/s]                        | 3931 [msg/s]         |
|   **3072 Byte** | 3326 [msg/s]                        | 3043 [msg/s]         |

### Tests with two subscribers listening to the same event:

  The results were almost the same for both the subscribers, so I just documented the worst.

|                 | **10.000  messages**                | **100.000 messages** |
| --------------: |:-----------------------------------:| :-------------------:|
|      **2 Byte** | 2774 [msg/s]                        | 2858 [msg/s]         |
|     **64 Byte** | 2707 [msg/s]                        | 2759 [msg/s]         |
|   **3072 Byte** | 2304 [msg/s]                        | 2327 [msg/s]         |

  You can test the performance yourself:

    $ cd node_modules/brokowski
    
    # start broker at http://localhost:3000
    $ node startBroker.js

    $ cd perf

    # connect as many subscribers as you like
    $ node startSubscriber.js 6000 my-event http://localhost:3000 4096 10000
    
    # start publishing 10000 events with a msg size of 4096 byte
    $ node startPublisher.js http://localhost:3000 my-event 4096 10000 

## Known errors

  * Brokowski does remove broken subscribers, but in the current version (0.1.2) it doesn't do this reliably under big load (like the performance tests). That's because incoming http requests can block the handling of errors based on broken subscribers.

## TODO

  * automatic subscriptions clean up
  * parallelizing
  * broker config options
  * HTTPS
  * message qeueing?
  * broker as connect middleware?
  * subscriber priority?
  * instructions for use with forever

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/Horsed/brokowski/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
