const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");

const TrainingAttendance = models.trainingattendance;
const Training = models.training

class TrainingAttendanceDao extends SuperDao {
    constructor() {
        super(TrainingAttendance);
    }

    async getCount(filter) {
         let { search, employee_id, training_id } = filter
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
                ...(training_id && { training_id }),
                ...(employee_id && { "$training.employee_id$": employee_id })
            },
            include: [
                {
                    model: Training
                }
            ]
        });
    }

    async getPage(offset, limit, filter) {
         let { search, employee_id, training_id } = filter
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
                ...(training_id && { training_id }),
                ...(employee_id && { "$training.employee_id$": employee_id })
            },
            include: [
                {
                    model: Training
                }
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = TrainingAttendanceDao;
