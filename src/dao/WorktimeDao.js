const models = require("../models");
const { Op, literal } = require("sequelize");
const SuperDao = require("./SuperDao");

const Worktime = models.worktime;
const Division = models.division
const Weekday = models.weekday
const Employees = models.employees
const EmployeeOutstation = models.employeeoutstation
const EmployeeAttendance = models.employeeattendance

class WorktimeDao extends SuperDao {
    constructor() {
        super(Worktime);
    }

    async getCount(filter) {
        let { search } = filter
        if (!search) search = ""
        return Worktime.count({
            where: {
                [Op.or]: [
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
            ]
        });
    }

    async getPage(offset, limit, filter) {
        let { search } = filter
        if (!search) search = ""
        return Worktime.findAll({
            where: {
                [Op.or]: [
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
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async getByUID(uid) {
        return Worktime.findOne({ where: { uid } })
    }

    async getByDivisionId(division_id) {
        return Worktime.findAll({ where: { division_id } })
    }

    async getShortestTime(division_id) {
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

    async getTodayEmployee(employee) {
        console.log(employee)
        const current = new Date().toISOString().split('T')[0]
        const startDate = `${current}T00:00:00.000Z`
        const endDate = `${current}T23:59:59.999Z`

        const { division_id, id } = employee
        return Worktime.findAll({
            where: { division_id },
            include: [
                {
                    model: EmployeeAttendance,
                    where: {
                        employee_id: id,
                        createdAt: {
                            [Op.between]: [startDate, endDate]
                        }
                    },
                    required: false
                }
            ],
            order: [['start_time', 'ASC']]
        })
    }

    async getUnfinishTodayOrder(employee, date) {
        const startTime = date.toISOString().split('T')[0] + "T00:00:00.000Z"
        const { division_id } = employee
        return Worktime.findAll({
            where: {
                division_id,
            },
            include: [
                {
                    model: EmployeeAttendance,
                    required: false,
                    where: {
                        employee_id: employee.id,
                        created_at: { [Op.between]: [startTime, date.toISOString()] }
                    },
                }
            ],
            order: [['start_time', 'ASC']]
        })
    }

    async getForAutoAttend() {
        const currentTime = new Intl.DateTimeFormat('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Jakarta',
        }).format(new Date()).replace(/\./g, ':')
        return Worktime.findAll({
            where: {
                [Op.and]: [
                    { start_time: { [Op.lte]: currentTime } },
                    { end_time: { [Op.gte]: currentTime } }
                ]
            },
            include:
            {
                model: Division,
                required: true,
                include: [
                    {
                        model: Employees,
                        required: true,
                        include: [
                            {
                                model: EmployeeAttendance,
                                required: false
                            },
                            {
                                model: EmployeeOutstation,
                                where: { is_active: true },
                                required: true,
                            }
                        ]
                    }
                ]
            }
        });
    }
}

module.exports = WorktimeDao;
