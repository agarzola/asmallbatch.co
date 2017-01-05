var should = require('should')
var validate = require('./validate')
var required_fields = require('./validate_these_fields')

describe('validate', () => {
  var body
  beforeEach(() => {
    body = {}
    required_fields.forEach(field => {
      if (field === 'email') {
        body[field] = 'client@mcclientface.com'
      } else {
        body[field] = 'a string value'
      }
    })
  })

  afterEach(() => {
    body = null
  })

  it('should return a promise', done => {
    var validation = validate(body)
    validation.should.be.instanceOf(Promise)
    done()
  })

  it('should bypass submissions w/o a body', done => {
    validate()
      .then(result => {
        should.not.exist(result)
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
      some_shitty_field: 'some shitty value'
    }
    validate(shitty_body)
      .then(result => {
        throw new Error('Promise was not rejected.')
      }, result => {
        result.should.be.instanceOf(Object)
        should.exist(result.data)
        result.data.should.equal(shitty_body)
        should.exist(result.errors)
        var errors = result.errors
        errors.should.be.instanceOf(Object)
        Object.keys(errors).length.should.equal(6)
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
        should.exist(result.data)
        result.data.should.equal(body)
        should.exist(result.errors)
        var errors = result.errors
        errors.should.be.instanceOf(Object)
        Object.keys(errors).length.should.equal(1)
        errors.email.should.be.instanceOf(String)
      })
      .then(done).catch(done)
  })
})
