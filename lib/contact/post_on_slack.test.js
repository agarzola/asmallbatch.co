var should = require('should')
var sinon = require('sinon')
var proxyquire = require('proxyquire')
var http_mocks = require('node-mocks-http')
var url = require('url')
var events = require('events')

describe('post_on_slack', () => {
  var post_on_slack, res_mock, generated_options, generated_data
  var webhook = url.parse('https://fakewebhook.com/some/path')
  var body = {
    full_name: 'Client McClienty',
    email: 'client.mcclienty@clientsonandsons.com',
    organization_or_project: 'Clientsons & Sons, Inc.'
  }

  beforeEach(() => {
    res_mock = http_mocks.createResponse({
      eventEmitter: events.EventEmitter
    })
    post_on_slack = proxyquire('./post_on_slack', {
      'https': {
        request: (options, callback) => {
          generated_options = options
          callback(res_mock)
          return {
            on: () => {},
            write: data => { generated_data = data},
            end: () => {}
          }
        }
      }
    })
  })

  afterEach(() => {
    generated_options = null
    generated_data = null
  })

  it('defines request options using a webhook url', done => {
    post_on_slack(webhook, body)
    should.exist(generated_options)
    generated_options.should.be.instanceOf(Object)
    generated_options.protocol.should.equal('https:')
    generated_options.method.should.equal('POST')
    generated_options.host.should.equal('fakewebhook.com')
    generated_options.path.should.equal('/some/path')
    generated_options.headers.should.be.instanceOf(Object)
    generated_options.headers['Content-Type'].should.equal('application/x-www-form-urlencoded')
    generated_options.headers['Content-Length'].should.be.instanceOf(Number)
    done()
  })
  it('creates a message with an attachment', done => {
    post_on_slack(webhook, body)
    should.exist(generated_data)
    var data = JSON.parse(generated_data)
    data.text.should.equal('Client McClienty just filled out the Small Batch questionnaire.')
    data.attachments.should.be.instanceOf(Array)
    data.attachments.length.should.equal(1)
    var attachment = data.attachments[0]
    attachment.fallback.should.equal('New request for contact from Client McClienty')
    attachment.fields.should.be.instanceOf(Array)
    attachment.fields.length.should.equal(3)
    attachment.fields.forEach(field => {
      should.exist(field.title)
      should.exist(field.value)
      should.exist(field.short)
    })
    done()
  })
  it('returns a promise', done => {
    post_on_slack(webhook, body).should.be.instanceOf(Promise)
    done()
  })
  it('resolves with a 200 status code when successful', done => {
    post_on_slack(webhook, body)
      .then(result => {
        result.status.should.equal(200)
        result.message.should.equal('Thank you! We’ll be in touch soon.')
        should.not.exist(result.data) })
      .then(done).catch(done)
    res_mock.statusCode = 200
    res_mock.emit('data', 'ok')
    res_mock.emit('end')
  })
  it('resolves with a different status code and data object when unsuccessful', done => {
    post_on_slack(webhook, body)
      .then(result => {
        result.status.should.equal(404)
        result.message.should.equal('An error message from Slack')
        result.data.should.equal(body) })
      .then(done).catch(done)
    res_mock.statusCode = 404
    res_mock.emit('data', 'An error message from Slack')
    res_mock.emit('end')
  })
})
