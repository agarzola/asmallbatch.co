var should = require('should')
var sinon = require('sinon')
var forward_to_secure = require('./forward_to_secure')

describe('forward_to_secure', () => {
  var req_live_stub = {
    url: '/some/path?with=parameters#and-anchor',
    headers: {
      host: 'ahosteddomain.com'
    }
  }
  var req_local_stub = {
    url: '/some/path?with=parameters#and-anchor',
    headers: {
      host: 'localhost:8079'
    }
  }
  var res_mock = {
    writeHead: function (code, headers) {},
    end: function () {}
  }
  var req, res
  it('should redirect an http request to its https equivalent')
  it('should include port 8080 when host is localhost', done => {
    var req = sinon.stub(req_local_stub)
    var res_spy = sinon.spy(res_mock, 'writeHead')

    forward_to_secure(req, res_mock)
    res_spy.calledWith(301, {
      Location: `https://localhost:8080${req_local_stub.url}`
    }).should.equal(true)

    done()
  })
})
