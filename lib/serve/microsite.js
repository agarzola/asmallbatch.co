var pug = require('pug')
var env = process.env.NODE_ENV
var render = pug.compileFile('assets/markup/index.pug', { pretty: false })

module.exports = serve_microsite

function serve_microsite (req, res, locals) {
  var xhr = req.headers['x-requested-with'] === 'XMLHttpRequest'

  locals = locals || {}
  var status_code = locals.status || 200
  var status_msg = locals.status && locals.status !== 200 ? locals.message : 'OK'

  if (xhr) {
    res.writeHead(status_code, status_msg, {
      'Content-Type': 'application/json'
    })
    res.end(locals)
  } else {
    var html = render(locals)
    res.writeHead(status_code, status_msg, {
      'Content-Type': 'text/html'
    })
    return res.end(html)
  }
}
