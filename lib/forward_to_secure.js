var url = require('url')

module.exports = forward_to_secure

function forward_to_secure (req, res) {
  var url_parts = req.url ? url.parse(req.url, true) : {}

  var new_location = 'https://'
  new_location += req.headers.host.replace(/\:\d{4}/, '') // remove port from request hostname
  new_location += req.headers.host.match(/localhost/) ? ':8080' : '' // add secure port if dev
  new_location += url_parts.path || ''
  new_location += url_parts.hash || ''

  res.writeHead(301, {
    Location: new_location
  })

  res.end()
}
