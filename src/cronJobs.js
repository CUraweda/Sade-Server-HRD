const cron = require('node-cron');
const closeJobVacancy = require("./service/cron/CloseVacancy")
const changeStatusTraining = require('./service/cron/ChangeStatusTraining')
// Sync report access by bills
cron.schedule('0 * * * *', closeJobVacancy);
cron.schedule('0 0 * * *', changeStatusTraining);
