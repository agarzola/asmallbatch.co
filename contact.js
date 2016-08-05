var http = require('http')
var https = require('https')
var qs = require('querystring')
var url = require('url')

var server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(302, {
      'Location': '/' })
    return res.end()
  }

  var body = ''

  req.on('data', chunk => { body += chunk })
  req.on('end', () => {
    res.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
    res.end()

    var decoded_body = qs.parse(body)
    send_to_slack(decoded_body)
  })
})

server.listen(3000)
console.log('Listening for form submissions on port 3000.')

function send_to_slack (body) {
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
