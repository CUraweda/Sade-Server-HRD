const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, fn, col, literal } = require("sequelize");
const Employees = require("../models/Employees");

const EmployeeAttendance = models.employeeattendance;
const EmployeeVacation = models.employeevacation
const Division = models.division
const Employee = models.employees
const Worktime = models.worktime


class EmployeeAttendanceDao extends SuperDao {
    constructor() {
        super(EmployeeAttendance);
    }

    async getCount(filter) {
        let { search, outstation, type, status, division_id, date, employee_id } = filter
        if (!search) search = ""

        return EmployeeAttendance.count({
            where: {
                [Op.or]: [
                    {
                        worktime_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        "$employee.full_name$": { [Op.like]: "%" + search + "%" },
                    },

                    {
                        uid: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        status: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        is_outstation: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(employee_id && { employee_id }),
                ...(date && { created_at: { [Op.between]: [date.start_date, date.end_date] } }),
                ...(division_id && { "$worktime.division_id$": division_id }),
                ...(type && { "$worktime.type$": { [Op.like]: `%${type}%` } }),
                ...(status && { status }),
                ...(outstation && { is_outstation: outstation != "1" ? false : true }),
                // ...((start_date && end_date) && { created_at: { [Op.between]: [start_date, end_date] } })
            },
            include: [
                {
                    model: Worktime,
                    required: false
                },
                {
                    model: Employee,
                    required: false,
                    include: [
                        {
                            model: Division,
                            required: false
                        }
                    ]
                },
            ]
        });
    }

    async getPage(offset, limit, filter) {
        let { search, outstation, type, status, division_id, date, employee_id, } = filter
        if (!search) search = ""
        return EmployeeAttendance.findAll({
            where: {
                [Op.or]: [
                    {
                        worktime_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        "$employee.full_name$": { [Op.like]: "%" + search + "%" },
                    },
                    {
                        uid: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        description: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        status: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        is_outstation: { [Op.like]: "%" + search + "%" },
                    },
                ],
                ...(employee_id && { employee_id }),
                ...(date && { created_at: { [Op.between]: [date.start_date, date.end_date] } }),
                ...(division_id && { "$worktime.division_id$": division_id }),
                ...(type && { "$worktime.type$": { [Op.like]: `%${type}%` } }),
                ...(status && { status }),
                ...(outstation && { is_outstation: outstation != "1" ? false : true }),
                // ...((start_date && end_date) && { created_at: { [Op.between]: [start_date, end_date] } })
            },
            include: [
                {
                    model: Worktime,
                    required: false
                },
                {
                    model: Employee,
                    required: false,
                    include: [
                        {
                            model: Division,
                            required: false
                        }
                    ]
                },
            ],
            offset: offset,
            limit: limit,
            order: [["id", "DESC"]],
        });
    }

    async countAttendanceStartEnd(employee_id, start_date, end_date) {
        return EmployeeAttendance.count({
            where: {
                ...(employee_id && { employee_id }),
                created_at: {
                    [Op.between]: [start_date, end_date]
                }
            }
        })
    }

    async getByRange(start_date, end_date, filter) {
        const { employee_id } = filter
        return EmployeeAttendance.findAll({
            where: {
                ...(employee_id && { employee_id }),
                created_at: {
                    [Op.between]: [start_date, end_date]
                }
            }
        })
    }

    async getByUID(uid) {
        return EmployeeAttendance.findOne({
            where: { uid }
        })
    }

    async getAttendanceRecap(start_date, end_date) {
        return Employee.findAll({
            attributes: ['full_name'],
            include: [
                {
                    model: EmployeeAttendance,
                    where: {
                        created_at: {
                            [Op.between]: [start_date, end_date]
                        }
                    },
                    required: false
                },
                {
                    model: EmployeeVacation,
                    where: {
                        [Op.or]: [
                            {
                                start_date: {
                                    [Op.between]: [start_date, end_date]
                                }
                            },
                            {
                                end_date: {
                                    [Op.between]: [start_date, end_date]
                                }
                            }
                        ]
                    },
                    required: false
                }
            ],
            order: [['id', "ASC"]]
        }).then(results => {
            return results.map(result => {
                const attendanceCount = result.employeeattendances ? result.employeeattendances.length : 0;

                let cutiCount = 0, izinCount = 0
                if (result.employeevacations.length > 0) {
                    cutiCount = result.employeevacations.filter(vacation => vacation.type === 'CUTI').length
                    izinCount = result.employeevacations.filter(vacation => vacation.type === 'IZIN').length
                }

                return {
                    full_name: result.full_name,
                    attendance_count: attendanceCount,
                    cuti_count: cutiCount,
                    izin_count: izinCount
                }
            })
        });
    }

    async deleteAndReduceWorkhour(id) {
        const dataExist = await EmployeeAttendance.findOne({
            where: { id },
            include: [{ model: Employee, required: false }]
        })
        if (!dataExist) return false

        const deleteData = await EmployeeAttendance.destroy({ where: { id: dataExist.id } })
        if (!deleteData) return false

        const raw_workhour = dataExist.employee.raw_workhour - dataExist.attendance_time_differences
        const updateEmployee = await Employee.update({ raw_workhour }, { where: { id: dataExist.employee.id } })
        if (!updateEmployee) return false

        return deleteData
    }

    async getDataStatus(filter) {
        const { employee_id, date, search } = filter
        return EmployeeAttendance.findAll({
            where: {
                ...(search && {
                    [Op.or]: [
                        {
                            worktime_id: { [Op.like]: "%" + search + "%" },
                        },
                        {
                            "$employee.full_name$": { [Op.like]: "%" + search + "%" },
                        },
                        {
                            uid: { [Op.like]: "%" + search + "%" },
                        },
                        {
                            description: { [Op.like]: "%" + search + "%" },
                        },
                        {
                            status: { [Op.like]: "%" + search + "%" },
                        },
                        {
                            is_outstation: { [Op.like]: "%" + search + "%" },
                        },
                    ]
                }),
                ...(employee_id && { employee_id }),
                ...(date && { created_at: { [Op.between]: [date.start_date, date.end_date] } })
            },
            include: [
                {
                    model: Employee,
                    attributes: ['full_name'],
                    required: false
                }
            ],
            attributes: ["status"]
        })
    }

    async totalAttendanceWorktimeRange(start_date, end_date) {
        return EmployeeAttendance.findAll({
            where: {
                attendance_time_differences: { [Op.not]: 0 },
                createdAt: { [Op.between]: [start_date, end_date] }
            },
            attributes: [
                [models.sequelize.fn('SUM', models.sequelize.col('attendance_time_differences')), "total_worktime"]
            ],

        })
    }
}

module.exports = EmployeeAttendanceDao;
