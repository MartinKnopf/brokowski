var assert = require('assert')
  , should = require('should')
  , monitoring = require('../rest/monitoring');

describe('Monitoring', function() {

  it('should return 200 for alive check', function() {
    monitoring.check('alive').should.equal(200);
  });
});
