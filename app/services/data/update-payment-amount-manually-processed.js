const config = require('../../../knexfile').asyncworker
const knex = require('knex')(config)

module.exports = function (claimId, totalAmount) {
  return knex('IntSchema.Claim')
    .where('ClaimId', claimId)
    .update('PaymentAmountManuallyProcessed', totalAmount)
}
