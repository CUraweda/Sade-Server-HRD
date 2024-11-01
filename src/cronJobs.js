const cron = require('node-cron');
const closeJobVacancy = require("./service/cron/CloseVacancy")
// Sync report access by bills
cron.schedule('0 * * * *', closeJobVacancy);
