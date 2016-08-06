module.exports = serve_error

function serve_error (req, res, code, message) {
  res.writeHead(code || 500)
  return res.end(message || 'Internal server error')
}
