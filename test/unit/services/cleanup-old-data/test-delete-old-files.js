const expect = require('chai').expect
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const CLAIM_ID = 1234
const ELIGIBILITY_ID = 4321
const REFERENCE = 'DELFILE'
const CLAIM_DOCUMENT_FILEPATH = [{ Filepath: '1' }]
const CLAIM_DOCUMENT_NO_FILEPATH = [{}]
const CLAIM_DOCUMENT_NO_DATA = []

let getClaimDocuments
let AWS
let deleteOldFiles
let deleteFunction

describe('services/cleanup-old-data/delete-old-files', function () {
  beforeEach(function () {
    getClaimDocuments = sinon.stub()
    deleteFunction = sinon.stub()

    const helper = function () {
      return {
        delete: deleteFunction
      }
    }

    AWS = {
      AWSHelper: helper
    }

    deleteOldFiles = proxyquire('../../../../app/services/cleanup-old-data/delete-old-files', {
      '../aws-helper': AWS,
      '../data/get-claim-documents': getClaimDocuments
    })
  })

  it('should call to delete a file based on filepath', function () {
    getClaimDocuments.resolves(CLAIM_DOCUMENT_FILEPATH)
    return deleteOldFiles(ELIGIBILITY_ID, CLAIM_ID, REFERENCE)
      .then(function () {
        expect(getClaimDocuments.calledWith('ExtSchema', REFERENCE, ELIGIBILITY_ID, CLAIM_ID)).to.be.true //eslint-disable-line
        expect(deleteFunction.called).to.be.true //eslint-disable-line
      })
  })

  it('should copy eligibility directory to archive when archiving eligibility', function () {
    getClaimDocuments.resolves(CLAIM_DOCUMENT_NO_FILEPATH)
    return deleteOldFiles(ELIGIBILITY_ID, CLAIM_ID, REFERENCE)
      .then(function () {
        expect(deleteFunction.called).to.be.false //eslint-disable-line
      })
  })

  it('should not call to delete a file for no claim data', function () {
    getClaimDocuments.resolves(CLAIM_DOCUMENT_NO_DATA)
    return deleteOldFiles(ELIGIBILITY_ID, CLAIM_ID, REFERENCE)
      .then(function () {
        expect(deleteFunction.called).to.be.false //eslint-disable-line
      })
  })
})
