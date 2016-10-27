const config = require('../../../knexfile').asyncworker
const knex = require('knex')(config)
const statusEnum = require('../../constants/status-enum')
const Task = require('../domain/task')

module.exports = function (batchSize) {
  return knex.select().table('ExtSchema.Task').where('Status', statusEnum.PENDING).limit(batchSize)
    .then(function (results) {
      var tasks = []
      var ids = []
      if (results) {
        for (var result of results) {
          ids.push(result.TaskId)
          tasks.push(new Task(
            result.TaskId,
            result.Task,
            result.Reference,
            result.ClaimId,
            result.AdditionalData,
            result.DateCreated,
            result.DateProcessed,
            statusEnum.INPROGRESS))
        }
      } else {
        return []
      }
      return knex('ExtSchema.Task').whereIn('TaskId', ids)
        .update('Status', statusEnum.INPROGRESS)
        .then(function () {
          return tasks
        })
    })
}
