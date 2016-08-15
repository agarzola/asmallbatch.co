var should = require('should')
var sinon = require('sinon')
var parse_form = require('./parse_form')
var http_mocks = require('node-mocks-http')
var qs = require('querystring')

describe('parse_form', () => {
  var req_mock
  beforeEach(() => {
    req_mock = http_mocks.createRequest({
      method: 'POST',
      url: '/',
      body: {
        full_name: 'Client McClienty',
        email: 'client.mcclienty@clientsonandsons.com',
        organization_or_project: 'Clientsons & Sons, Inc.'
      }
    })
  })

  afterEach(() => {
    req_mock = null
  })

  it('should return a promise', done => {
    var parse = parse_form(req_mock)
    parse.should.be.instanceOf(Promise)
    done()
  })

  it('should resolve with an object', done => {
    parse_form(req_mock)
      .then(body => {
        body.should.be.instanceOf(Object)
        Object.keys(req_mock.body).forEach(key => {
          body[key].should.equal(req_mock.body[key])
        })
      })
      .then(done)
      .catch(done)
    req_mock.emit('data', qs.stringify(req_mock.body))
    req_mock.emit('end')
  })
})
