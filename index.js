var https = require('https')
var qs = require('querystring')
var url = require('url')
var fs = require('fs')
var pug = require('pug')

var certs = {
  key: fs.readFileSync('certs/key.pem'),
  cert: fs.readFileSync('certs/cert.pem')
}

var server = https.createServer(certs, route)

server.listen(8080)
console.log('Listening on port 8080.')

function route (req, res) {
  req.url_parts = url.parse(req.url, true)

  if (req.url_parts.path === '/') {
    switch (req.method) {
      case 'GET':
        return serve_microsite(req, res)
        break
      case 'POST':
        return process_form(req, res)
        break
      default:
        return serve_error(req, res, 405, 'Method not allowed')
    }
  } else if (req.url_parts.path.match(/^\/(?:images|stylesheets|javascript)/)) {
    return serve_assets(req, res)
  } else {
    return serve_error(req, res, 404, 'Document not found')
  }
}

function process_form (req, res) {
  var body = ''
  var xhr = req.headers['x-requested-with'] === 'XMLHttpRequest'

  req.on('data', chunk => { body += chunk })
  req.on('end', () => {
    if (xhr) {
      res.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
    } else {
      res.writeHead(302, {
        Location: '/'
      })
    }
    res.end()

    var decoded_body = qs.parse(body)
    post_on_slack(decoded_body)
  })
}

function serve_assets(req, res) {
  var file_path = __dirname + '/assets' + req.url_parts.pathname
  fs.stat(file_path, (err, stat) => {
    if (err !== null) { return serve_error(req, res, 404, 'File not found') }
    var file_stream = fs.createReadStream(file_path)
    file_stream.on('open', () => {
      file_stream.pipe(res)
    })
    file_stream.on('error', error => {
      res.end(error)
    })
  })
}

function serve_microsite (req, res, locals) {
  var render = pug.compileFile('source/markup/index.pug', { pretty: false })
  var html = render(locals)

  res.writeHead(200, 'OK', {
    'Content-Type': 'text/html'
  })
  return res.end(html)
}

function serve_error (req, res, code, message) {
  res.writeHead(code)
  return res.end(message)
}

function post_on_slack (body) {
  var webhook = url.parse(process.env.SLACK_WEBHOOK_URL)

  var data = JSON.stringify({
    text: `${body.full_name} just filled out the Small Batch questionnaire.`,
    attachments: [{
      fallback: `New request for contact from ${body.full_name}`,
      fields: Object.keys(body).map(field => {
        return {
          title: prettify_field_name(field),
          value: body[field],
          short: (['full_name', 'email', 'organization_or_project', 'start', 'end']
            .indexOf(field) > -1)
        }
      })
    }]
  })

  var options = {
    protocol: 'https:',
    host: webhook.host,
    path: webhook.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  }

  var request = https.request(options, res => {
    res.setEncoding('utf8')
    res.on('error', err => console.log('error:', err))
  })

  request.write(data)
  request.end()
}

function prettify_field_name (field) {
  var pretty = field.replace(/_/g, ' ');
  pretty = pretty[0].toUpperCase() + pretty.slice(1)
  return pretty
}
