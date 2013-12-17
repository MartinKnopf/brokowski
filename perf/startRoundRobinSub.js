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
  console.log('usage: local_thr <port> <event> <broker>');
  process.exit(1);
}

var port = process.argv[2];
var event = process.argv[3];
var broker = process.argv[4];

sub.start(port, event, broker);

sub.resubscribe({
  event: event,
  method: 'post',
  roundRobin: true,
  handler: function (data) {
    console.log(data);
  }
});