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
         let { search } = filter
        if(!search) search = ""
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
                    }
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
         let { search } = filter
        if(!search) search = ""
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

    async getByUID(uid){
        return Worktime.findOne({ where: { uid } })
    }

    async getByDivisionId(division_id){
        return Worktime.findAll({ where: { division_id } })
    }

    async getShortestTime(division_id){
        const currentTime = new Date();
        const worktimes = await this.getByDivisionId(division_id)

        let shortestDifference = null;
        let closestWorktime = null;

        worktimes.forEach(worktime => {
            const startTime = new Date(`1970-01-01T${worktime.start_time}Z`);
            const endTime = new Date(`1970-01-01T${worktime.end_time}Z`);

            const startDiff = Math.abs(currentTime - startTime);
            const endDiff = Math.abs(currentTime - endTime);

            const minDiff = Math.min(startDiff, endDiff);

            if (shortestDifference === null || minDiff < shortestDifference) {
                shortestDifference = minDiff;
                closestWorktime = worktime;
            }
        });

        return { shortestDifference, closestWorktime }
    }
}

module.exports = WorktimeDao;
