var pug = require('pug')
var env = process.env.NODE_ENV
var render = pug.compileFile('assets/markup/index.pug', { pretty: false })

module.exports = serve_microsite

function serve_microsite (req, res, locals) {
  var xhr = req.headers['x-requested-with'] === 'XMLHttpRequest'
  if (xhr) {
    res.writeHead(locals ? 400 : 200, locals ? 'Bad request' : 'OK')
    res.end(locals)
  } else {
    var html = render(locals)
    res.writeHead(200, 'OK', {
      'Content-Type': 'text/html'
    })
    return res.end(html)
  }
}
