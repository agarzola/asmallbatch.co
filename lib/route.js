var url = require('url')
var Serve = require('./serve')
var Contact = require('./contact')
var webhook = url.parse(process.env.SLACK_WEBHOOK_URL)

module.exports = route

function route (req, res) {
  req.url_parts = url.parse(req.url, true)
  var serve = new Serve(req, res)

  if (req.url_parts.path === '/') {
    switch (req.method) {
      case 'GET':
        serve.microsite()
        break

      case 'POST':
        var contact = new Contact(req, res, webhook)
        var results
        contact.process_form()
          .then(results => serve.microsite(results))
          .catch(e => {
            console.log('An error ocurred while processing the contact form:',
              e.message)
            serve.error(e.status, e.message)
          })
        break

      default:
        return serve.error(405, 'Method not allowed')
    }
  } else if (req.url_parts.path.match(/^\/(?:images|stylesheets|javascript)/)) {
    return serve.assets()
  } else {
    return serve.error(404, 'Document not found')
  }
}
