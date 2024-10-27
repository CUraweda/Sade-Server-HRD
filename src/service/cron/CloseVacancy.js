const { Op } = require("sequelize")
const models = require('../../models')
const JobVacancy = models.jobvacancy

module.exports = async function closeVacancy() {
    try{
        const currentDate = new Date()
        await JobVacancy.update({ is_open: false, status: "Ditutup" }, {
            where: { end_date: { [Op.lte]: currentDate } }
        })

        console.log(`============== Closing Vacancy, checked at ${currentDate.toISOString()}`)
    }catch(e){
        console.log(e)
    }
}