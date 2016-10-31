const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-bluebird')

const config = require('../../../../config')

var emailAddress = 'test@test.com'
var reference = '1234567'

var stubSendNotification = sinon.stub().resolves()

const sendAcceptedClaimNotification = proxyquire('../../../../app/services/workers/send-accepted-claim-notification', {
  '../notify/send-notification': stubSendNotification
})

describe('services/send-accepted-claim-notification', function () {
  it('should call send-notification with correct details', function (done) {
    sendAcceptedClaimNotification.execute({
      reference: reference,
      additionalData: emailAddress
    })
    .then(function () {
      expect(stubSendNotification.called).to.be.true
      expect(stubSendNotification.firstCall.args[0]).to.be.equal(config.NOTIFY_ACCEPTED_CLAIM_EMAIL_TEMPLATE_ID)
      expect(stubSendNotification.firstCall.args[1]).to.be.equal(emailAddress)
      expect(stubSendNotification.firstCall.args[2].reference).to.be.equal(reference)

      done()
    })
  })
})
