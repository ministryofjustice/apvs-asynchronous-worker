const expect = require('chai').expect
const testHelper = require('../../../test-helper')
const moment = require('moment')

const getDataForAutoApprovalCheck = require('../../../../app/services/data/get-data-for-auto-approval-check')
var reference = 'AUTOAPP'
var claimData
var previousClaims

describe('services/data/get-data-for-auto-approval-check', function () {
  before(function () {
    var uniqueId = Math.floor(Date.now() / 100) - 13000000000
    claimData = testHelper.getFirstTimeClaimData(reference)

    return testHelper.insertClaimData('IntSchema', reference, claimData.Claim.EligibilityId, claimData).then(function (ids) {
      previousClaims = [
        {
          Claim: {
            ClaimId: uniqueId,
            EligibilityId: claimData.Claim.EligibilityId,
            Reference: reference,
            DateOfJourney: moment().subtract(60, 'days').toDate(),
            DateCreated: moment().subtract(50, 'days').toDate(),
            DateSubmitted: moment().subtract(40, 'days').toDate(),
            Status: 'APPROVED'
          }
        },
        {
          Claim: {
            ClaimId: uniqueId + 1,
            EligibilityId: claimData.Claim.EligibilityId,
            Reference: reference,
            DateOfJourney: moment().subtract(90, 'days').toDate(),
            DateCreated: moment().subtract(80, 'days').toDate(),
            DateSubmitted: moment().subtract(70, 'days').toDate(),
            Status: 'REJECTED'
          }
        }
      ]

      var createClaims = []
      previousClaims.forEach(function (previousClaim) {
        createClaims.push(testHelper.insertClaimData('IntSchema', reference, uniqueId + 1, previousClaim))
      })

      return Promise.all(createClaims)
    })
  })

  it('should return all current and previous claim data associated to the claimant', function () {
    return getDataForAutoApprovalCheck(claimData.Claim)
      .then(function (result) {
        expect(result.previousClaims).to.not.be.null
        expect(result.latestManuallyApprovedClaim).to.not.be.null
        expect(result.latestManuallyApprovedClaim.ClaimId).to.equal(result.previousClaims[0].ClaimId)
      })
  })

  after(function () {
    return testHelper.deleteAll(reference, 'IntSchema')
  })
})