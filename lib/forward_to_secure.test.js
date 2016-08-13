var should = require('should')
var sinon = require('sinon')
var forward_to_secure = require('./forward_to_secure')

describe('forward_to_secure', () => {
  var res_mock, res_spy

  beforeEach(() => {
    res_mock = {
      writeHead: function (code, headers) {},
      end: function () {}
    }
    res_spy = sinon.spy(res_mock, 'writeHead')
  })

  it('should redirect an http request without a path', done => {
    var req_stub = sinon.stub({
      url: null,
      headers: { host: 'ahosteddomain.com' }
    })

    forward_to_secure(req_stub, res_mock)
    res_spy.calledWith(301, {
      Location: `https://${req_stub.headers.host}`
    }).should.equal(true)

    done()
  })

  it('should redirect an http request with a path to its https equivalent', done => {
    var req_stub = sinon.stub({
      url: '/some/path?with=parameters#and-anchor',
      headers: { host: 'ahosteddomain.com' }
    })

    forward_to_secure(req_stub, res_mock)
    res_spy.calledWith(301, {
      Location: `https://${req_stub.headers.host + req_stub.url}`
    }).should.equal(true)

    done()
  })

  it('should include port 8080 when host is localhost', done => {
    var req_stub = sinon.stub({
      url: '/some/path?with=parameters#and-anchor',
      headers: { host: 'localhost:8079' }
    })

    forward_to_secure(req_stub, res_mock)
    res_spy.calledWith(301, {
      Location: `https://localhost:8080${req_stub.url}`
    }).should.equal(true)

    done()
  })
})
