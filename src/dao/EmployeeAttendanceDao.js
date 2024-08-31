const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op, fn, col } = require("sequelize");

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
         let { search, outstation, type, status, division_id, date, employee_id, start_date, end_date } = filter
        if(!search) search = ""

        return EmployeeAttendance.count({
            where: {
                [Op.or]: [
                    {
                        worktime_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
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
                ...(date && { created_at: { [Op.startsWith]: date } }),
                ...(division_id && { "$worktime.division_id$": division_id }),
                ...(type && { "$worktime.type$": { [Op.like]: `%${type}%` } }),
                ...(status && { status }),
                ...(outstation && { is_outstation: outstation != "1" ? false : true }),
                ...((start_date && end_date) && { created_at: { [Op.between]: [start_date, end_date] }})
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
         let { search, outstation, type, status, division_id, date, employee_id, start_date, end_date } = filter
        if(!search) search = ""
        return EmployeeAttendance.findAll({
            where: {
                [Op.or]: [
                    {
                        worktime_id: { [Op.like]: "%" + search + "%" },
                    },
                    {
                        employee_id: { [Op.like]: "%" + search + "%" },
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
                ...(date && { created_at: { [Op.startsWith]: date } }),
                ...(division_id && { "$worktime.division_id$": division_id }),
                ...(type && { "$worktime.type$": { [Op.like]: `%${type}%` } }),
                ...(status && { status }),
                ...(outstation && { is_outstation: outstation != "1" ? false : true }),
                ...((start_date && end_date) && { created_at: { [Op.between]: [start_date, end_date] }})
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

    async countAttendanceStartEnd(employee_id, start_date, end_date){
        return EmployeeAttendance.count({
            where: {
                ...(employee_id && { employee_id }),
                created_at: {
                    [Op.between]: [start_date, end_date]
                }
            }
        })
    }

    async getByRange(start_date, end_date, filter){
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
                    attributes: [[fn('COUNT', col('employeeattendances.id')), 'attendance_count']],
                    where: {
                        created_at: {
                            [Op.between]: [start_date, end_date]
                        }
                    },
                    required: false // Use LEFT JOIN to include employees with no attendance records
                },
                {
                    model: EmployeeVacation,
                    attributes: [[fn('COUNT', col('employeevacations.id')), 'vacation_count']],
                    where: {
                        start_date: {
                            [Op.between]: [start_date, end_date]
                        }
                    },
                    required: false // Use LEFT JOIN to include employees with no vacation records
                }
            ],
            group: ['employees.id'], // Group by employee to get the correct counts
        }).then(results => {
            return results.map(result => ({
                full_name: result.full_name,
                attendance: result.employeeattendances[0]?.get('attendance_count') || 0,
                vacation: result.employeevacations[0]?.get('vacation_count') || 0
            }));
        });
    }
}

module.exports = EmployeeAttendanceDao;
