var microsite = require('./microsite')
var assets = require('./assets')
var error = require('./error')

module.exports = Serve

function Serve (req, res) {
  this.req = req
  this.res = res
}

Serve.prototype.microsite = function (locals) {
  return microsite(this.req, this.res, locals)
}

Serve.prototype.assets = function () {
  return assets(this.req, this.res)
}

Serve.prototype.error = function (code, message) {
  return error(this.req, this.res, code, message)
}
