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
}

module.exports = TrainingDao;
