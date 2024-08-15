const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Training = models.training;

class TrainingDao extends SuperDao {
    constructor() {
        super(Training);
    }

    async getCount(filter) {
         let { search } = filter
        if(!search) search = ""
        return Training.count({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: "%" + search + "%" } },
                    { purpose: { [Op.like]: "%" + search + "%" } },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
         let { search } = filter
        if(!search) search = ""
        return Training.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: "%" + search + "%" } },
                    { purpose: { [Op.like]: "%" + search + "%" } },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getClosestActive(employee_id, currentTime){
        return Training.findAll({
            where: {
                employee_id,
                [Op.and]: [
                    {
                        start_date: { [Op.lte]: currentTime },
                        end_date: { [Op.gte]: currentTime }
                    }
                ],
                is_active: true
            }
        })
    }

}

module.exports = TrainingDao;
