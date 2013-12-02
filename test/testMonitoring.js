var assert = require('assert')
  , should = require('should')
  , http = require('http')
  , request = require('request')
  , app;

beforeEach(function() {
  app = require('../app.js');
});

describe('Monitoring', function() {

  it('should return 200 for alive check', function() {
    request.get('http://localhost:3000/monitoring/alive', function(err, res, body) {
      res.statusCode.should.equal(200);
    });
  });
});
