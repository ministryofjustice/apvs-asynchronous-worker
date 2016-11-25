const config = require('../../../knexfile').asyncworker
const knex = require('knex')(config)

const getDataForAutoApprovalChecks = require('../data/get-data-for-auto-approval-check')
const statusEnum = require('../../constants/status-enum')

const autoApprovalChecks = [
  require('./checks/is-latest-manual-claim-approved'),
  require('./checks/is-no-previous-pending-claim')
]

module.exports = function (claimData) {
  var result = {checks: []}

  // Fail auto-approval check if status has been set to Pending in the copy-claim-data-to-internal module
  if (claimData.Claim.Status === statusEnum.PENDING) {
    result.claimApproved = false
    return result
  }

  return getDataForAutoApprovalChecks(claimData.Claim)
    .then(function (autoApprovalData) {
      for (var check in autoApprovalChecks) {
        var checkResult = autoApprovalChecks[check](autoApprovalData)
        result.checks.push(checkResult)
      }

      result.claimApproved = true
      // Loop through result properties, if any are false, then the claim should not be approved
      result.checks.forEach(function (check) {
        if (!check.result) {
          result.claimApproved = false
        }
      })

      if (result.claimApproved) {
        return knex('IntSchema.Claim')
          .where('ClaimId', claimData.Claim.ClaimId)
          .update('Status', statusEnum.AUTOAPPROVED)
          .then(function () {
            return result
          })
      } else {
        return result
      }
    })
}