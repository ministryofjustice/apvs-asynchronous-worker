const config = require('../../../config')
const sendNotification = require('../notify/send-notification')

module.exports.execute = function (task) {
  var reference = task.reference
  var personalisation = {reference: reference}

  var emailAddress = task.additionalData
  var emailTemplateId = config.NOTIFY_FIRST_TIME_CLAIM_EMAIL_TEMPLATE_ID

  return sendNotification(emailTemplateId, emailAddress, personalisation)
}
