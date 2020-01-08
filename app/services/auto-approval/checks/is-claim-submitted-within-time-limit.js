const moment = require('moment')

const AutoApprovalCheckResult = require('../../domain/auto-approval-check-result')

const CHECK_NAME = 'is-claim-submitted-within-time-limit'
const FAILURE_MESSAGE = 'Claim was not submitted with the time limit'

module.exports = function (autoApprovalData) {
  var claimSubmissionDateMoment = moment(autoApprovalData.Claim.DateOfJourney)
  var claimSubmissionCutOffDate
  if (autoApprovalData.latestManuallyApprovedClaim) {
    claimSubmissionCutOffDate = moment(autoApprovalData.latestManuallyApprovedClaim.DateReviewed).add(autoApprovalData.maxDaysAfterAPVUVisit, 'days')
  } else {
    return new AutoApprovalCheckResult(CHECK_NAME, false, 'There is no manually approved claim for this eligibility')
  }

  var checkPassed = claimSubmissionDateMoment.isSameOrBefore(claimSubmissionCutOffDate)

  return new AutoApprovalCheckResult(CHECK_NAME, checkPassed, checkPassed ? '' : FAILURE_MESSAGE)
}
