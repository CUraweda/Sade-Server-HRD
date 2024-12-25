const { Op } = require("sequelize")
const models = require('../../models')
const Training = models.training

module.exports = async function changeStatusTraining() {
    try {
        const currentDate = new Date()
        //Change to 'Selesai'
        await Training.update({ is_active: false, status: "Selesai" }, {
            where: { is_active: true, status: "Sedang Berjalan", end_date: { [Op.lte]: currentDate } }
        })

        //Change to 'Sedang Berjalan'
        await Training.update({ is_active: true, status: "Sedang Berjalan" }, {
            where: { is_active: true, status: "Menunggu Pelaksanaan", start_date: { [Op.lte]: currentDate } }
        })

        console.log(`============== Changing Status Training, checked at ${currentDate.toISOString()}`)
    } catch (e) {
        console.log(e)
    }
}