const getClaimsPendingPayment = require('../data/get-claims-pending-payment')
const createPaymentFile = require('../direct-payments/create-payment-file')
const updateClaimsProcessedPayment = require('../data/update-claims-processed-payment')
const insertDirectPaymentFile = require('../data/insert-direct-payment-file')
const fileTypes = require('../../constants/payment-filetype-enum')
const _ = require('lodash')
const paymentMethods = require('../../constants/payment-method-enum')
const log = require('../log')

module.exports.execute = function (task) {
  var claimIds

  return getClaimsPendingPayment(paymentMethods.DIRECT_BANK_PAYMENT.value)
    .then(function (paymentData) {
      if (paymentData.length > 0) {
        var missingData = checkForAccountNumberAndSortCode(paymentData)
        if (missingData) {
          log.info(`Data is missing from direct payment ${paymentData}`)
          return Promise.reject('Data is missing')
        }
        var claimIdIndex = 0
        claimIds = getClaimIdsFromPaymentData(paymentData, claimIdIndex)
        removeClaimIdsFromPaymentData(paymentData, claimIdIndex)
        return createPaymentFile(paymentData)
          .then(function (result) {
            return insertDirectPaymentFile(result, fileTypes.ACCESSPAY_FILE)
              .then(function () {
                return updateAllClaimsProcessedPayment(claimIds, paymentData)
              })
          })
      }
    })
}

function getClaimIdsFromPaymentData (paymentData, claimIdIndex) {
  return _.map(paymentData, p => { return p[claimIdIndex] })
}

function removeClaimIdsFromPaymentData (paymentData, claimIdIndex) {
  paymentData.forEach(function (data) { data.splice(claimIdIndex, 1) })

  return paymentData
}

function updateAllClaimsProcessedPayment (claimIds, paymentData) {
  var promises = []

  for (var i = 0; i < claimIds.length; i++) {
    var claimPaymentData = paymentData[i]
    var claimId = claimIds[i]

    var totalApprovedCostIndex = 3
    promises.push(updateClaimsProcessedPayment(claimId, parseFloat(claimPaymentData[totalApprovedCostIndex])))
  }

  return Promise.all(promises)
}

function checkForAccountNumberAndSortCode (paymentData) {
  var missingData = false
  paymentData.forEach(function (data) {
    // Checks Account Number and Sort Code
    if (!data[0] || !data[1]) {
      missingData = true
    }
  })

  return missingData
}
