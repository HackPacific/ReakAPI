var supertest = require('supertest'),
    expect = require('chai').expect,
    should = require('chai').should(),
    api = supertest('http://localhost:3000');

describe('Session', function() {
  it('should return a 200 response', function(done) {
    api.get('/messages')
    .expect(401, done)
  })
});
