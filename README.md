brokowski [![Build Status](https://secure.travis-ci.org/Horsed/brokowski.png)](http://travis-ci.org/Horsed/brokowski) [![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://github.com/hughsk/stability-badges)
===========
 
Brokered RESTful publish/subscribe: Broker, publisher and subscriber talking via RESTful interfaces.

Brokowski has a RESTful pub/sub broker, which runs as a HTTP server. It receives subscriptions and events via a RESTful API. The events will be forwarded to the connected subscriber services. Forwarding can be done in a round-robin strategy (default) or in a loop strategy (decreases throughput).
Brokowski also includes publisher and subcriber modules, which offer simple APIs for the event handling. They take care of setting up HTTP servers, connecting to the broker and sending/receiving events via the broker's RESTful API, making it easy to include pub/sub event handling into your apps. But since the broker runs on HTTP you can connect your own services via HTTP, too.

broker.js:
```js
var brokowski = require('brokowski').broker().start(6000); // runs at http://192.168.0.1:6000
```

subscriber.js:
```js
// should at http://192.168.0.2:6002/mysubscriber
var sub = require('brokowski').sub().start(6002, 'mysubscriber', 'http://192.168.0.1:6000');

// sub always gets notified when this event is published
sub
  .get('my-event', function(data) {
    if(data.coolstuff)
      console.log('get my-event');
  })
  .post('my-event', function(data) {
    if(data.coolstuff)
      console.log('post my-event');
  })
  .put('my-event', function(data) {
    if(data.coolstuff)
      console.log('put my-event');
  })
  .delete('my-event', function(data) {
    if(data.coolstuff)
      console.log('delete my-event');
  })
  .subscribe({
    event: 'my-other-event',
    method: 'GET',
    roundRobin: false,
    handler: function(data) {
      console.log('GET my-other-event');
    }
  });
```

publisher.js:
```js
var pub = require('brokowski').pub('http://192.168.0.1:6000');
pub.send('my-event', {coolstuff: true});
```

## Installation

  Node.js >=0.10 is required

    $ npm install brokowski

## RESTful API of the broker

  ### Subscription options
    
    | mandatory option | description                                                                                              | example                                                      |
    | :--------------- | :------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------- |
    | **event**        | subscribed event                                                                                         | ```'my-event'```                                             |
    | **hostname**     | subscriber host (default: ```'localhost'```)                                                             | ```'192.168.0.77'```                                         |
    | **port**         | subscriber port (default: port provided to ```sub.start()```)                                            | ```1234```                                                   |
    | **path**         | subscriber uri path (default: service name, event: ```/myservice/GET/myevent```)                         | ```'/myservice/subscriptions'```                             |
    | **method**       | HTTP method                                                                                              | ```'GET'``` or ```'POST'``` or ```'PUT'``` or ```'DELETE'``` |
    | **roundRobin**   | whether sub should get notified in a round-robin queue or whenver the ovent occurs (default: ```true```) | ```true``` or ```false```                                    |

    **The default options are only used in** ```sub.subscribe(options)```

  ### subscribe

    * method: POST
    * url: ```http://localhost:6000/subscribe/myevent```
    * json: see the options
    * returns 200 if everything is ok
    * returns 400 if json is incomplete
    * returns 500 if subscriber url already subscribed to event

  ### resubscribe

    All subscribers (partially) matching the given json will be removed before the new subscription.
    * method: POST
    * url: ```http://localhost:6000/resubscribe/myevent```
    * json: see the options
    * returns 200 if everything is ok
    * returns 400 if json is incomplete

  ### unsubscribe

    All subscribers (partially) matching the given json will be removed.
    * method: POST
    * url: ```http://localhost:6000/unsubscribe/myevent```
    * json: see the options
    * returns 200 if everything is ok

  ### publish

    * method: POST
    * url: ```http://localhost:6000/publish/myevent```
    * json: any
    * returns 200 if everything is ok

  ### monitoring

    * method: GET
    * url: ```http://localhost:6000/monitoring/alive```
    * should return ```200```

## Performance (0.1.1)

  For the performance tests I used most of the test code of [node-zmq](https://github.com/JustinTulloss/zeromq.node).

  My machine:

    * Windows 7 64bit
    * AMD Phenom(tm) II X4 955 @ 3.2 GHz
    * 6 GB memory
    * 100 Mbit LAN

  ### Tests with single subscriber:

    |                 | **10.000  messages** | **100.000 messages** |
    | --------------: |:--------------------:| :-------------------:|
    |      **2 Byte** | 3568 [msg/s]         | 3658 [msg/s]         |
    |     **64 Byte** | 3556 [msg/s]         | 3585 [msg/s]         |
    |   **3072 Byte** | 3118 [msg/s]         | 3043 [msg/s]         |
    | **64.000 Byte** | 1187 [msg/s]         | publisher process ran out of memory |

  ### Tests with two looped subscribers listening to the same event:

    The results are almost the same for both the subscribers.

    |                 | **10.000  messages** | **100.000 messages** |
    | --------------: |:--------------------:| :-------------------:|
    |      **2 Byte** | 2541 [msg/s]         | 2317 [msg/s]         |
    |     **64 Byte** | 2501 [msg/s]         | 2422 [msg/s]         |
    |   **3072 Byte** | 2213 [msg/s]         | 2119 [msg/s]         |
    | **64.000 Byte** | 528 [msg/s]          | publisher process ran out of memory |

  You can test the performance yourself:

    $ cd node_modules/brokowski
    
    $ # start broker at http://localhost:3000
    $ node startBroker.js

    $ cd perf

    $ # connect as many subscribers as you like
    $ node startSubscriber.js 6000 my-event http://localhost:3000 64000 10000
    
    $ # start publishing 10000 events with a msg size of 64000 byte
    $ node startPublisher.js http://localhost:3000 my-event 64000 10000 

## TODO

  * there is a memory leak caused by resubscription of the same subscriber (unsubscribing has to fix this)
  * unsubscribing
  * automatic subscriptions clean up
  * subscribing should fail when not receiving 200
  * broker config options
  * HTTPS
  * message qeueing?
  * broker as connect middleware?
  * subscriber priority?
  * instructions for use with forever

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/Horsed/brokowski/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
