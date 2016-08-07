var should = require('should')
var sinon = require('sinon')
var http_mocks = require('node-mocks-http')
var microsite = require('./microsite')
var Browser = require('zombie')

describe('microsite', () => {
  var req_mock, res_mock, res_spy, locals, browser

  describe('xhr requests', () => {
    beforeEach(() => {
      req_mock = http_mocks.createRequest({
        headers: { 'x-requested-with': 'XMLHttpRequest' }
      })
      res_mock = {
        writeHead: function () {},
        end: function () {}
      }
    })
    afterEach(() => {
      req_mock = res_mock = res_spy = locals = browser = null
    })
    it('should respond with a JSON object', done => {
      res_spy = sinon.spy(res_mock, 'end')
      microsite(req_mock, res_mock)
      res_spy.calledWith(sinon.match.object).should.equal(true)
      done()
    })
    it('should set success headers', done => {
      res_spy = sinon.spy(res_mock, 'writeHead')
      microsite(req_mock, res_mock)
      res_spy.calledWith(200, 'OK', {
        'Content-Type': 'application/json'
      }).should.equal(true)
      done()
    })
    it('should include a data object', done => {
      res_spy = sinon.spy(res_mock, 'end')
      microsite(req_mock, res_mock)
      res_spy.calledWith(sinon.match.object).should.equal(true)
      done()
    })
    describe('on successful form submission', () => {
      it('should set success headers', done => {
        res_spy = sinon.spy(res_mock, 'writeHead')
        locals = {
          status: 200,
          message: 'Mock success message'
        }
        microsite(req_mock, res_mock, locals)
        res_spy.calledWith(locals.status, 'OK', {
          'Content-Type': 'application/json'
        }).should.equal(true)
        done()
      })
      it('should have a message in the data object', done => {
        res_spy = sinon.spy(res_mock, 'end')
        locals = {
          status: 200,
          message: 'Mock success message'
        }
        microsite(req_mock, res_mock, locals)
        res_spy.calledWith(locals).should.equal(true)
        done()
      })
    })
    describe('on unsuccessful form submission', () => {
      it('should set error headers', done => {
        res_spy = sinon.spy(res_mock, 'writeHead')
        locals = {
          status: 405,
          message: 'Mock error message'
        }
        microsite(req_mock, res_mock, locals)
        res_spy.calledWith(locals.status, locals.message, {
          'Content-Type': 'application/json'
        })
        done()
      })
      it('should have a message in the data object', done => {
        res_spy = sinon.spy(res_mock, 'end')
        locals = {
          status: 405,
          message: 'Mock error message'
        }
        microsite(req_mock, res_mock, locals)
        res_spy.calledWith(locals).should.equal(true)
        done()
      })
      it('should have an array of errors in the data object')
    })
  })

  describe('non-xhr requests', () => {
    beforeEach(() => {
      req_mock = http_mocks.createRequest({
        headers: {}
      })
      res_mock = {
        writeHead: function () {},
        end: function () {}
      }
      res_spy = null
    })
    it('should respond with HTML string', done => {
      res_spy = sinon.spy(res_mock, 'end')
      microsite(req_mock, res_mock)
      res_spy.calledWith(sinon.match.string).should.equal(true)
      done()
    })
    it('should set success headers', done => {
      res_spy = sinon.spy(res_mock, 'writeHead')
      microsite(req_mock, res_mock)
      res_spy.calledWith(200, 'OK', {
        'Content-Type': 'text/html'
      }).should.equal(true)
      done()
    })

    describe('on successful form submission', () => {
      it('should set success headers', done => {
        res_spy = sinon.spy(res_mock, 'writeHead')
        locals = {
          status: 200,
          message: 'Mock success message'
        }
        microsite(req_mock, res_mock, locals)
        res_spy.calledWith(200, 'OK', {
          'Content-Type': 'text/html'
        }).should.equal(true)
        done()
      })
      it.skip('should include a success message in the HTML', done => {
        var result
        res_mock.end = function (html) { result = html }
        res_spy = sinon.spy(res_mock, 'end')
        locals = {
          status: 200,
          message: 'Mock success message'
        }
        microsite(req_mock, res_mock, locals)
        var browser = new Browser()
        browser.load(result, () => {
          browser.assert.element('form .message.success', 'Missing success message.')
          done()
        })
      })
    })

    describe('on unsuccessful form submission', () => {
      it('should set error headers', done => {
        res_spy = sinon.spy(res_mock, 'writeHead')
        locals = {
          status: 405,
          message: 'Mock error message'
        }
        microsite(req_mock, res_mock, locals)
        res_spy.calledWith(locals.status, locals.message, {
          'Content-Type': 'text/html'
        }).should.equal(true)
        done()
      })
      it.skip('should include an error message in the HTML', done => {
        var result
        res_mock.end = function (html) { result = html }
        res_spy = sinon.spy(res_mock, 'end')
        locals = {
          status: 200,
          message: 'Mock success message'
        }
        microsite(req_mock, res_mock, locals)
        var browser = new Browser()
        browser.load(result, () => {
          browser.assert.element('form .message.error', 'Missing error message.')
          done()
        })
      })
      it.skip('should include error labels for fields', done => {
        var result
        res_mock.end = function (html) { result = html }
        res_spy = sinon.spy(res_mock, 'end')
        locals = {
          status: 200,
          message: 'Mock success message'
        }
        microsite(req_mock, res_mock, locals)
        var browser = new Browser()
        browser.load(result, () => {
          browser.assert.elements('form label.error', 4, 'Missing error labels.')
          done()
        })
      })
    })
  })
})
