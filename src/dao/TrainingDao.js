const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const Training = models.training;

class TrainingDao extends SuperDao {
    constructor() {
        super(Training);
    }

    async getCount(filter) {
        let { search, status, employee_id } = filter
        if (!search) search = ""
        return Training.count({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: "%" + search + "%" } },
                    { purpose: { [Op.like]: "%" + search + "%" } },
                ],
                ...(employee_id && { employee_id }),
                ...(status && { status: { [Op.like]: `%${status}%` } })
            },
        });
    }

    async getPage(offset, limit, filter) {
        let { search, status, employee_id, active} = filter
        if (!search) search = ""
        return Training.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: "%" + search + "%" } },
                    { purpose: { [Op.like]: "%" + search + "%" } },
                ],
                ...(active && { is_active: true }),
                ...(employee_id && { employee_id }),
                ...(status && { status: { [Op.like]: `%${status}%` } })
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getAllActive(){
        return Training.findAll({
            where: { is_active: true }
        })
    }

    async getClosestActive(employee_id, currentTime) {
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
