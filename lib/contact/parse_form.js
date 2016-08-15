var qs = require('querystring')

module.exports = process_form

function process_form (req) {
  var body = ''
  return new Promise((resolve, reject) => {
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        var processed_form = qs.parse(body)
        return resolve(processed_form)
      }
      catch (e) { return reject(e) }
    })
  })
}
