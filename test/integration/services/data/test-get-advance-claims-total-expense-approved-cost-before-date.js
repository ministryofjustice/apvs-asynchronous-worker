const expect = require('chai').expect
const testHelper = require('../../../test-helper')
const dateFormatter = require('../../../../app/services/date-formatter')

const getAdvanceClaimsTotalExpenseApprovedCostBeforeDate = require('../../../../app/services/data/get-advance-claims-total-expense-approved-cost-before-date')

describe('services/data/get-advance-claims-total-expense-approved-cost-before-date', function () {
  const REFERENCE = 'AMOUNTO'
  let claimId
  const date = dateFormatter.now().add('1', 'd').toDate()
  let amount

  before(function () {
    const data = testHelper.getClaimData(REFERENCE)
    amount = data.ClaimExpenses[0].ApprovedCost + data.ClaimExpenses[1].ApprovedCost
    return testHelper.insertClaimEligibilityData('IntSchema', REFERENCE, 'TESTING')
      .then(function (ids) {
        claimId = ids.claimId
      })
  })

  it('should get all advance claims before specifed date with status', function () {
    return getAdvanceClaimsTotalExpenseApprovedCostBeforeDate(date, 'TESTING')
      .then(function (claims) {
        expect(claims[0].ClaimId).to.be.equal(claimId)
        expect(claims[0].Reference).to.be.equal(REFERENCE)
        expect(claims[0].Amount).to.be.equal(amount)
      })
  })

  after(function () {
    return testHelper.deleteAll(REFERENCE, 'IntSchema')
  })
})
