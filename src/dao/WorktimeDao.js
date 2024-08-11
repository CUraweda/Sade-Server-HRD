const models = require("../models");
const { Op } = require("sequelize");
const SuperDao = require("./SuperDao");

const Worktime = models.worktime;
const Division = models.division
const Weekday = models.weekday

class WorktimeDao extends SuperDao {
    constructor() {
        super(Worktime);
    }

    async getCount(filter) {
        const { search } = filter;
        return Worktime.count({
            where: {
                [Op.or]: [
                    {
                        "$weekday.name$": { [Op.like]: "%" + search + "%" },
                    },
                    {
                        "$division.name$": { [Op.like]: "%" + search + "%" },
                    },
                    {
                        uid: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        type: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        start_time: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        end_time: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            include: [
                {
                    model: Division,
                    required: true
                },
                {
                    model: Weekday,
                    required: true
                },
            ]
        });
    }

    async getPage(offset, limit, filter) {
        const { search } = filter;
        return Worktime.findAll({
            where: {
                [Op.or]: [
                    {
                        "$weekday.name$": { [Op.like]: "%" + search + "%" },
                    },
                    {
                        "$division.name$": { [Op.like]: "%" + search + "%" },
                    },
                    {
                        uid: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        type: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        start_time: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        end_time: { [Op.like]: "%" + search + "%" },
                    },
                ],
            },
            include: [
                {
                    model: Division,
                    required: true
                },
                {
                    model: Weekday,
                    required: true
                },
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }
}

module.exports = WorktimeDao;
