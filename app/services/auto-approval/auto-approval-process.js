const config = require('../../../config')

const getDataForAutoApprovalChecks = require('../data/get-data-for-auto-approval-check')
const insertClaimEventData = require('../data/insert-claim-event-data')
const generateFailureReasonString = require('../notify/helpers/generate-failure-reason-string')
const autoApproveClaim = require('../data/auto-approve-claim')
const claimTypeEnum = require('../../constants/claim-type-enum')
const statusEnum = require('../../constants/status-enum')

const autoApprovalChecks = [
  require('./checks/are-children-under-18'),
  require('./checks/cost-and-variance-equal-or-less-than-first-time-claim'),
  require('./checks/do-expenses-match-first-time-claim'),
  require('./checks/has-claimed-less-than-max-times-this-year'),
  require('./checks/has-uploaded-prison-visit-confirmation-and-receipts'),
  require('./checks/is-claim-submitted-within-time-limit'),
  require('./checks/is-claim-total-under-limit'),
  require('./checks/is-latest-manual-claim-approved'),
  require('./checks/is-no-previous-pending-claim'),
  require('./checks/is-prison-not-in-guernsey-jersey'),
  require('./checks/is-visit-in-past'),
  require('./checks/visit-date-different-to-previous-claims')
]

module.exports = function (reference, eligibilityId, claimId) {
  var autoApprovalEnabled = config.AUTO_APPROVAL_ENABLED === 'true'

  if (autoApprovalEnabled) {
    return getDataForAutoApprovalChecks(reference, eligibilityId, claimId)
      .then(function (autoApprovalData) {
        var result = {checks: []}

        // Fail auto-approval check if First time claim or status is PENDING
        if (autoApprovalData.Claim.ClaimType === claimTypeEnum.FIRST_TIME ||
          autoApprovalData.Claim.Status === statusEnum.PENDING) {
          result.claimApproved = false
          return result
        }

        autoApprovalChecks.forEach(function (check) {
          var checkResult = check(autoApprovalData)
          result.checks.push(checkResult)
        })

        result.claimApproved = true
        // Loop through result properties, if any are false, then the claim should not be approved
        result.checks.forEach(function (check) {
          if (!check.result) {
            result.claimApproved = false
          }
        })

        if (result.claimApproved) {
          return autoApproveClaim(claimId, autoApprovalData.Visitor.EmailAddress)
            .then(function () {
              return result
            })
        } else {
          return insertClaimEventData(autoApprovalData.Claim, 'AUTO-APPROVAL-FAILURE', autoApprovalData.Visitor.EmailAddress, generateFailureReasonString(result.checks), true)
          .then(function () {
            return result
          })
        }
      })
  } else {
    return Promise.resolve(null)
  }
}
