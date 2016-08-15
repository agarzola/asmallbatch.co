var should = require('should')
var validate = require('./validate')

describe('validate', () => {
  var body
  beforeEach(() => {
    body = {
      required_fields: 'full_name,email',
      full_name: 'Client McClientface',
      email: 'client@clientsonandsons.com',
      organization_or_project: 'Clientson & Sons, Inc.'
    }
  })

  afterEach(() => {
    body = null
  })

  it('should return a promise', done => {
    var validation = validate(body)
    validation.should.be.instanceOf(Promise)
    done()
  })

  it('should bypass submissions w/o required fields', done => {
    delete body.required_fields
    validate(body)
      .then(result => {
        result.should.equal(body)
      }).then(done).catch(done)
  })

  it('should resolve with the object given if valid', done => {
    validate(body)
      .then(result => {
        should.exist(result)
        result.should.be.instanceOf(Object)
        result.should.be.instanceOf(Object)
        result.should.equal(body)
      })
      .then(done).catch(done)
  })

  it('should resolve with an object w/errors for missing data', done => {
    var shitty_body = {
      required_fields: body.required_fields
    }
    validate(shitty_body)
      .then(result => {
        throw new Error('Promise was not rejected.')
      }, result => {
        result.should.be.instanceOf(Object)
        should.exist(result.errors)
        var errors = result.errors
        errors.should.be.instanceOf(Object)
        Object.keys(errors).length.should.equal(2)
        Object.keys(errors).forEach(field => {
          errors[field].should.be.instanceOf(String)
        })
      })
      .then(done).catch(done)
  })
  it('should resolve with an object w/errors for invalid data', done => {
    body.email = 'not-an email'
    validate(body)
      .then(result => {
        throw new Error('Promise was not rejected.')
      }, result => {
        result.should.be.instanceOf(Object)
        should.exist(result.errors)
        var errors = result.errors
        errors.should.be.instanceOf(Object)
        Object.keys(errors).length.should.equal(1)
        errors.email.should.be.instanceOf(String)
      })
      .then(done).catch(done)
  })
})
