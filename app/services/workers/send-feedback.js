const RatingEnum = require('../../constants/rating-enum')
const Config = require('../../../config')
const Zendesk = require('zendesk-node-api')

module.exports.execute = function (task) {
  const feedback = task.additionalData.split('~~')
  let subjectText = 'Help With Prison Visits - Feedback'
  let tagText = ['HelpWithPrisonVisits']
  const personalisation = {
    rating: RatingEnum[feedback[0]].displayName,
    improvements: feedback[1],
    contactEmailAddress: feedback[2]
  }

  if (Config.ZENDESK_ENABLED === 'true') {
    const zendesk = new Zendesk({
      url: Config.ZENDESK_API_URL,
      email: Config.ZENDESK_EMAIL_ADDRESS,
      token: Config.ZENDESK_API_KEY
    })

    if (Config.ZENDESK_TEST_ENVIRONMENT === 'true') {
      subjectText = 'Test: Help With Prison Visits - Feedback'
      tagText = ['HelpWithPrisonVisits', 'Test']
    }

    if (personalisation.contactEmailAddress === '') {
      return zendesk.tickets.create({
        submitter_id: '114198238551',
        requester_id: '114198238551',
        subject: subjectText,
        comment: {
          body: personalisation.improvements + '\n\n' +
          'Rating: ' + personalisation.rating
        },
        tags: tagText
      }).then(function (result) {
        console.log('Zendesk ticket, ' + result.ticket.id + ' has been raised')
      })
    } else {
      return zendesk.tickets.create({
        submitter_id: '114198238551',
        requester: {
          name: personalisation.contactEmailAddress,
          email: personalisation.contactEmailAddress,
          verified: true
        },
        subject: subjectText,
        comment: {
          body: personalisation.improvements + '\n\n' +
          'Rating: ' + personalisation.rating
        },
        tags: tagText
      }).then(function (result) {
        console.log('Zendesk ticket, ' + result.ticket.id + ' has been raised')
      })
    }
  } else {
    return console.log('Zendesk not implemented in development environments.')
  }
}
