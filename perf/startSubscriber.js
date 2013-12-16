/**
  * Most of this stuff is used from the performance tests of node-zmq.
  * 
  * Copyright (c) 2011 TJ Holowaychuk
  * Copyright (c) 2010, 2011 Justin Tulloss

  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:

  * The above copyright notice and this permission notice shall be included in
  * all copies or substantial portions of the Software.

  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  * THE SOFTWARE.
  */

var assert = require('assert')
  , sub = require('../brokowski').sub();

if (process.argv.length != 5) {
  console.log('usage: local_thr <bind-to> <message-size> <message-count>');
  process.exit(1);
}

var bind_to = process.argv[2];
var message_size = Number(process.argv[3]);
var message_count = Number(process.argv[4]);
var counter = 0;

sub.start(6002, 'mysubscriber', bind_to);

var timer;

sub.post('my-event', function (data) {
  if (!timer) {
    console.log('started receiving');
    timer = process.hrtime();
  }

  if (++counter === message_count) finish();
})

function finish(){
  var endtime = process.hrtime(timer);
  var sec = endtime[0] + (endtime[1]/1000000000);
  var throughput = message_count / sec;
  var megabits = (throughput * message_size * 8) / 1000000;

  console.log('message size: %d [B]', message_size);
  console.log('message count: %d', message_count);
  console.log('mean throughput: %d [msg/s]', throughput.toFixed(0));
  console.log('mean throughput: %d [Mbit/s]', megabits.toFixed(0));
  console.log('overall time: %d secs and %d nanoseconds', endtime[0], endtime[1]);
}