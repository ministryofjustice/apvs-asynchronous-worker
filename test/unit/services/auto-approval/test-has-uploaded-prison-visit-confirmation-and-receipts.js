const expect = require('chai').expect
const hasUploadedPrisonVisitConfirmationAndReceipts = require('../../../../app/services/auto-approval/checks/has-uploaded-prison-visit-confirmation-and-receipts')

const withVisitConfirmation = {
  ClaimDocuments: [
    {
      ClaimDocumentId: 1,
      DocumentType: 'RECEIPT',
      DocumentStatus: null
    },
    {
      ClaimDocumentId: 2,
      DocumentType: 'RECEIPT',
      DocumentStatus: 'uploaded'
    },
    {
      ClaimDocumentId: 3,
      DocumentType: 'VISIT-CONFIRMATION',
      DocumentStatus: 'uploaded'
    }
  ]
}

const withoutVisitConfirmation = {
  ClaimDocuments: [
    {
      ClaimDocumentId: 1,
      DocumentType: 'RECEIPT',
      DocumentStatus: 'uploaded'
    },
    {
      ClaimDocumentId: 2,
      DocumentType: 'RECEIPT',
      DocumentStatus: 'uploaded'
    },
    {
      ClaimDocumentId: 3,
      DocumentType: 'RECEIPT',
      DocumentStatus: 'uploaded'
    },
    {
      ClaimDocumentId: 4,
      DocumentType: 'VISIT-CONFIRMATION',
      DocumentStatus: null
    }
  ]
}

const validAutoApprovalData = {
  ClaimDocuments: [
    {
      ClaimDocumentId: 1,
      DocumentType: 'RECEIPT',
      DocumentStatus: 'uploaded'
    },
    {
      ClaimDocumentId: 2,
      DocumentType: 'VISIT-CONFIRMATION',
      DocumentStatus: 'uploaded'
    }
  ]
}

describe('services/auto-approval/checks/has-uploaded-prison-visit-confirmation', function () {
  it('should return true if the claimant has uploaded all required documents', function () {
    var checkResult = hasUploadedPrisonVisitConfirmationAndReceipts(validAutoApprovalData)
    expect(checkResult.result).to.equal(true)
  })

  it('should return false if the claimant has not uploaded all required documents', function () {
    var checkResult = hasUploadedPrisonVisitConfirmationAndReceipts(withVisitConfirmation)
    expect(checkResult.result).to.equal(false)
  })

  it('should return false if the claimant uploaded all required documents except the prison visit confirmation', function () {
    var checkResult = hasUploadedPrisonVisitConfirmationAndReceipts(withoutVisitConfirmation)
    expect(checkResult.result).to.equal(false)
  })
})
