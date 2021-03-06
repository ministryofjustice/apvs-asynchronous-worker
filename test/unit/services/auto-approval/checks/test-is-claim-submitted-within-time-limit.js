const expect = require('chai').expect
const dateFormatter = require('../../../../../app/services/date-formatter')
const isClaimSubmittedWithinTimeLimit = require('../../../../../app/services/auto-approval/checks/is-claim-submitted-within-time-limit')

const validAutoApprovalData = {
  Claim: {
    ClaimId: 1,
    DateOfJourney: dateFormatter.now().subtract(2, 'days').toDate()
  },
  latestManuallyApprovedClaim: {
    DateReviewed: dateFormatter.now().subtract(30, 'days').toDate()
  },
  maxDaysAfterAPVUVisit: '28'
}

const invalidAutoApprovalData = {
  Claim: {
    ClaimId: 2,
    DateOfJourney: dateFormatter.now().subtract(1, 'days').toDate()
  },
  latestManuallyApprovedClaim: {
    DateReviewed: dateFormatter.now().subtract(30, 'days').toDate()
  },
  maxDaysAfterAPVUVisit: '28'
}

describe('services/auto-approval/checks/is-claim-submitted-within-time-limit', function () {
  it('should return true if the submission date is less than or equal to maxDayAfterAPVUVisit days after the date of journey of last manually approved claim', function () {
    const checkResult = isClaimSubmittedWithinTimeLimit(validAutoApprovalData)
    expect(checkResult.result).to.equal(true)
  })

  it('should return false if the submission date is greater than maxDayAfterAPVUVisit days after the date of journey of last manually approved claim', function () {
    const checkResult = isClaimSubmittedWithinTimeLimit(invalidAutoApprovalData)
    expect(checkResult.result).to.equal(false)
  })
})
