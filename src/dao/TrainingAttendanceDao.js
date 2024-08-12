const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const TrainingAttendance = models.trainingattendance;

class TrainingAttendanceDao extends SuperDao {
    constructor() {
        super(TrainingAttendance);
    }

    async getCount(filter) {
         let { search } = filter
        if(!search) search = ""
        return TrainingAttendance.count({
            where: {
                [Op.or]: [
                    {
                        title: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
        });
    }

    async getPage(offset, limit, filter) {
         let { search } = filter
        if(!search) search = ""
        return TrainingAttendance.findAll({
            where: {
                [Op.or]: [
                    {
                        title: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = TrainingAttendanceDao;
