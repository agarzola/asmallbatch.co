var url = require('url')
var process_form = require('./process_form')
var post_on_slack = require('./post_on_slack')

module.exports = Contact

function Contact (req, res, webhook) {
  this.req = req
  this.res = res
  this.webhook = webhook
}

Contact.prototype.process_form = function () {
  return process_form(this.req, this.res)
    .then(body => post_on_slack(this.webhook, body))
}
