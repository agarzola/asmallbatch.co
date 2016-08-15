var url = require('url')
var parse_form = require('./parse_form')
var post_on_slack = require('./post_on_slack')

module.exports = Contact

function Contact (req, res, webhook) {
  this.req = req
  this.res = res
  this.webhook = webhook
}

Contact.prototype.process_form = function () {
  return parse_form(this.req)
    .then(body => post_on_slack(this.webhook, body))
}
