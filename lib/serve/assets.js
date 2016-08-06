var fs = require('fs')
var serve_error = require('./error')

module.exports = serve_assets

function serve_assets (req, res) {
  var file_path = process.cwd() + '/assets' + req.url_parts.pathname
  fs.stat(file_path, (err, stat) => {
    if (err !== null) { return serve_error(req, res, 404, 'File not found') }
    var extension = file_path.match(/\.(.{2,3})$/)[1]
    res.writeHead(200, 'OK', {
      'Content-Type': extension === 'js' ? 'application/javascript' : extension === 'css' ? 'text/css' : 'image/' + extension
    })
    var file_stream = fs.createReadStream(file_path)
    file_stream.on('open', () => {
      file_stream.pipe(res)
    })
    file_stream.on('error', error => {
      res.end(error)
    })
  })
}
