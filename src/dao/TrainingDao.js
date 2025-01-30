const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, fn, col } = require("sequelize");

const Training = models.training;
const Employees = models.employees
const TrainingAttendance = models.trainingattendance

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
        let { search, status, employee_id, active, start_date, end_date } = filter
        if (!search) search = ""
        return Training.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: "%" + search + "%" } },
                    { purpose: { [Op.like]: "%" + search + "%" } },
                ],
                ...(active && { is_active: true }),
                ...(employee_id && { employee_id }),
                ...((start_date && end_date) && {
                    [Op.or]: [
                        { start_date: { [Op.between]: [start_date, end_date] } },
                        { end_date: { [Op.between]: [start_date, end_date] } },
                    ]
                }),
                ...(status && { status: { [Op.like]: `%${status}%` } })
            },
            include: [
                {
                    model: Employees,
                    as: "proposer",
                    required: false
                },
                {
                    model: Employees,
                    as: "employee",
                    required: false
                },
                {
                    model: TrainingAttendance,
                    orderBy: [['created_at', 'DESC'],],
                    required: false
                },
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getAllActive() {
        return Training.findAll({
            where: { is_active: true }
        })
    }

    async getStatusRecap() {
        return Training.findAll({
            attributes: ["status", [fn("COUNT", col("status")), "total_data"]],
            group: ["status"]
        })
    }

    async getByIdWithEmployee(id) {
        return Training.findOne({
            where: { id },
            include: [
                {
                    model: Employees,
                    as: "proposer",
                    required: false
                },
                {
                    model: Employees,
                    as: "employee",
                    required: false
                }
            ],
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
