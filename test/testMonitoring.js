var assert = require('assert')
  , should = require('should')
  , monitoring = require('../rest/monitoring');

describe('Monitoring', function() {

  it('should return 200 for alive check', function(done) {
    monitoring.check({
      params: {
        check: 'alive'
      }
    }, {
      send: function(statusCode) { statusCode.should.equal(200); done(); }
    });
  });
});
