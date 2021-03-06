require('dotenv').config()
require('./app/azure-appinsights')
const log = require('./app/services/log')
const processTasks = require('./app/process-tasks')

log.info('Started worker')

processTasks().then(function () {
  log.info('Worker completed processing tasks')
  process.exit()
})
