var moment = require('moment')



var generateMessage = function (from,text) {
  var message = { from: from, text: text, createdAt : moment().valueOf()}
  return message
}



module.exports = {
  generateMessage
}
