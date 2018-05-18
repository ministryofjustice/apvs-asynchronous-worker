
const getVisitorDwpBenefitCheckerData = require('../data/get-visitor-dwp-benefit-checker-data')
const callDwpBenefitCheckerSoapService = require('../benefit-checker/call-dwp-benefit-checker-soap-service')
const updateVisitorWithDwpBenefitCheckerResult = require('../data/update-visitor-with-dwp-benefit-checker-result')
const insertTask = require('../data/insert-task')
const tasksEnum = require('../../constants/tasks-enum')
const statusEnum = require('../../constants/status-enum')
const claimEventEnum = require('../../constants/claim-event-enum')
const insertClaimEventSystemMessage = require('../data/insert-claim-event-system-message')
const updateClaimStatus = require('../data/update-claim-status')
const sendDWPFailedEmailEnum = require('../../constants/dwp-failed-email-enum')
const config = require('../../../knexfile').asyncworker
const knex = require('knex')(config)
const dateFormatter = require('../date-formatter')
const autoApprovalProcess = require('../auto-approval/auto-approval-process')
const dwpCheckResultEnum = require('../../constants/dwp-check-result-enum')

module.exports.execute = function (task) {
  return getVisitorDwpBenefitCheckerData(task.reference, task.eligibilityId, task.claimId)
    .then(function (visitorDwpBenefitCheckerData) {
      return callDwpBenefitCheckerSoapService(visitorDwpBenefitCheckerData)
        .then(function (benefitCheckerResult) {
          if (benefitCheckerResult.result !== dwpCheckResultEnum.YES && sendDWPFailedEmailEnum[visitorDwpBenefitCheckerData.benefit]) {
            return insertTask(task.reference, task.eligibilityId, task.claimId, tasksEnum.DWP_FAILED_NOTIFICATION, visitorDwpBenefitCheckerData.email)
                .then(function () { return insertDummyUploadLaterBenefitDocument(task.claimId, visitorDwpBenefitCheckerData.benefit, task.eligibilityId, task.reference) })
                .then(function () { return insertClaimEventSystemMessage(task.reference, task.eligibilityId, task.claimId, null, claimEventEnum.CLAIM_REQUEST_INFORMATION.value, null, 'We have not been able to verify your benefit status. Please upload evidence of the benefit you receive', false) })
                .then(function () { return updateVisitorWithDwpBenefitCheckerResult(benefitCheckerResult.visitorId, benefitCheckerResult.result, statusEnum.REQUEST_INFORMATION) })
                .then(function () { return updateClaimStatus(task.claimId, statusEnum.REQUEST_INFORMATION) })
          } else {
            return updateVisitorWithDwpBenefitCheckerResult(benefitCheckerResult.visitorId, benefitCheckerResult.result, null)
              .then(function () { 
                if (benefitCheckerResult.result === dwpCheckResultEnum.YES) {
                  return autoApprovalProcess(task.reference, task.eligibilityId, task.claimId)
                }
              })
          }
        })
    })
}

function insertDummyUploadLaterBenefitDocument (claimId, benefit, eligibilityId, reference) {
  return knex('IntSchema.ClaimDocument').insert({
    ClaimDocumentId: (Math.floor(Date.now() / 100) - 14000000000) + 2, // taken from internal-claim-document.helper.js on external web
    ClaimId: claimId,
    EligibilityId: eligibilityId,
    Reference: reference,
    DocumentType: benefit,
    DocumentStatus: 'upload-later',
    IsEnabled: true,
    DateSubmitted: dateFormatter.now().toDate()
  })
}
