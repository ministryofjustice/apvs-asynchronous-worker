module.exports = {
  LOGGING_PATH: process.env.LOGGING_PATH,
  DATA_FILE_PATH: process.env.APVS_DATA_FILE_PATH || './data',
  LOGGING_LEVEL: process.env.LOGGING_LEVEL || 'DEBUG',
  LOGSTASH_HOST: process.env.LOGSTASH_HOST,
  LOGSTASH_PORT: process.env.LOGSTASH_PORT,

  // DB
  DATABASE_SERVER: process.env.APVS_DATABASE_SERVER,
  ASYNC_WORKER_USERNAME: process.env.APVS_ASYNC_WORKER_USERNAME,
  ASYNC_WORKER_PASSWORD: process.env.APVS_ASYNC_WORKER_PASSWORD,
  DATABASE: process.env.APVS_DATABASE,

  // Worker
  ASYNC_START_WEB: process.env.APVS_ASYNC_START_WEB || 'false',
  ASYNC_WORKER_CRON: process.env.APVS_PAYMENT_GENERATION_CRON || '* */2 * * * * *',
  ASYNC_WORKER_CONCURRENCY: process.env.APVS_ASYNC_WORKER_CONCURRENCY || 1,
  ASYNC_WORKER_BATCH_SIZE: process.env.APVS_ASYNC_WORKER_BATCH_SIZE || 5,

  // GOV Notify
  NOTIFY_API_URL: process.env.APVS_NOTIFY_API_URL || 'https://api.notifications.service.gov.uk',
  NOTIFY_API_KEY: process.env.APVS_NOTIFY_API_KEY,
  NOTIFY_CLIENT_ID: process.env.APVS_NOTIFY_CLIENT_ID,
  NOTIFY_DO_NOT_SEND_EMAIL: process.env.APVS_NOTIFY_DO_NOT_SEND_EMAIL || 'donotsend@apvs.com',
  APVS_TEST_EMAIL_ADDRESS: process.env.APVS_TEST_EMAIL_ADDRESS,

  // GOV Notify template IDs
  NOTIFY_ACCEPTED_CLAIM_EMAIL_TEMPLATE_ID: process.env.APVS_NOTIFY_ACCEPTED_CLAIM_EMAIL_TEMPLATE_ID,
  NOTIFY_REJECTED_CLAIM_EMAIL_TEMPLATE_ID: process.env.APVS_NOTIFY_REJECTED_CLAIM_EMAIL_TEMPLATE_ID,
  NOTIFY_REQUEST_INFORMATION_CLAIM_EMAIL_TEMPLATE_ID: process.env.APVS_NOTIFY_REQUEST_INFORMATION_CLAIM_EMAIL_TEMPLATE_ID,
  NOTIFY_SUBMIT_CLAIM_EMAIL_TEMPLATE_ID: process.env.APVS_NOTIFY_SUBMIT_CLAIM_EMAIL_TEMPLATE_ID,

  // DWP Benefit Checker
  DWP_BENEFIT_CHECKER_ENABLED: process.env.APVS_DWP_BENEFIT_CHECKER_ENABLED || 'true',
  DWP_BENEFIT_CHECKER_URL: process.env.APVS_DWP_BENEFIT_CHECKER_URL,
  DWP_BENEFIT_CHECKER_LSCSERVICENAME: process.env.APVS_DWP_BENEFIT_CHECKER_LSCSERVICENAME,
  DWP_BENEFIT_CHECKER_CLIENTORGID: process.env.APVS_DWP_BENEFIT_CHECKER_CLIENTORGID,
  DWP_BENEFIT_CHECKER_CLIENTUSERID: process.env.APVS_DWP_BENEFIT_CHECKER_CLIENTUSERID,
  DWP_BENEFIT_CHECKER_CLIENTREFERENCE: process.env.APVS_DWP_BENEFIT_CHECKER_CLIENTREFERENCE,

  // Payment Generation
  PAYMENT_GENERATION_CRON: process.env.APVS_PAYMENT_GENERATION_CRON || '* 10 * * * * *',
  PAYMENT_FILE_PATH: process.env.APVS_PAYMENT_FILE_PATH || 'payments',
  PAYMENT_CLEANUP_FILE_NUMBER_OF_DAYS: process.env.APVS_PAYMENT_CLEANUP_FILE_NUMBER_OF_DAYS || '28',

  // Auto approval configuration
  AUTO_APPROVAL_ENABLED: process.env.APVS_AUTO_APPROVAL_ENABLED || 'true',
  AUTO_APPROVAL_COST_VARIANCE_PERCENTAGE: process.env.APVS_AUTO_APPROVAL_COST_VARIANCE_PERCENTAGE || '0.1',
  AUTO_APPROVAL_MAX_CLAIM_TOTAL: process.env.APVS_AUTO_APPROVAL_MAX_CLAIM_TOTAL || '250',
  AUTO_APPROVAL_MAX_DAYS_AFTER_APVU_VISIT: process.env.APVS_AUTO_APPROVAL_MAX_DAYS_AFTER_APVU_VISIT || '28',
  AUTO_APPROVAL_MAX_NUMBER_OF_CLAIMS_PER_YEAR: process.env.APVS_AUTO_APPROVAL_MAX_NUMBER_OF_CLAIMS_PER_YEAR || '26'
}
