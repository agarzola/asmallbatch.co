var https = require('https')
var url = require('url')

module.exports = post_on_slack

function post_on_slack (webhook, body) {
  return new Promise((resolve, reject) => {
    var data = process_body(body)
    var options = define_options(webhook, data)

    var request = https.request(options, res => {
      var message = ''
      res.setEncoding('utf8')
      res.on('data', chunk => {
        message += chunk
      })
      res.on('end', () => {
        if (res.satusCode === 200) {
          resolve({
            status: 200,
            message: 'Thank you! We’ll be in touch soon.'
          })
        } else {
          resolve({
            status: res.statusCode,
            message: message,
            data: data
          })
        }
      })
    })

    request.on('error', e => {
      resolve({
        status: 500,
        message: 'We experienced an internal error. Please try submitting your form again, or <a href="mailto:hello@asmallbatch.co">send us an email.</a>',
        data: data
      })
    })

    request.write(data)
    request.end()
  })
}

function process_body (body) {
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

  return data
}

function define_options (webhook, data) {
  var options = {
    protocol: 'https:',
    host: webhook.host,
    path: webhook.path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  }

  return options
}

function prettify_field_name (field) {
  var pretty = field.replace(/_/g, ' ');
  pretty = pretty[0].toUpperCase() + pretty.slice(1)
  return pretty
}