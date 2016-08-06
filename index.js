var http = require('http')
var https = require('https')
var fs = require('fs')

var forward_to_secure = require('./lib/forward_to_secure')
var route = require('./lib/route')

var certs = {
  key: fs.readFileSync('certs/key.pem'),
  cert: fs.readFileSync('certs/cert.pem')
}

var insecure_server = http.createServer(forward_to_secure)
var secure_server = https.createServer(certs, route)

insecure_server.listen(8079)
secure_server.listen(8080)
console.log('Listening on port 8080.')
