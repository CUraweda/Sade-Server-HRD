const cron = require('node-cron');
const closeJobVacancy = require("./service/cron/CloseVacancy")
const changeStatusTraining = require('./service/cron/ChangeStatusTraining')
const autoAttendOutstation = require('./service/cron/AutoAttendOutstation')
// Sync report access by bills
cron.schedule('0 * * * *', closeJobVacancy);
cron.schedule('0 0 * * *', changeStatusTraining);
cron.schedule('0 * * * *', autoAttendOutstation);
