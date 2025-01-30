const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize")

const Employees = models.employees;
const User = models.user
const EmployeeAttendance = models.employeeattendance
const EmployeeVacation = models.employeevacation
const EmployeePosition = models.employeeposition
const EmployeeAccount = models.employeeaccount
const EmployeeAttachment = models.employeeattachment
const FormPosistion = models.formposition
const Training = models.training
const Division = models.division
const EmployeeEvaluation = models.employeeevaluation
const EmployeeSignature = models.employeesignature
class EmployeesDao extends SuperDao {
  constructor() {
    super(Employees);
  }

  async getEmployeeByIsTeacher(isTeacher) {
    return Employees.findAll({
      where: {
        is_teacher: isTeacher,
      },
    });
  }

  async getCount(filter) {
    const { search, division_id, status, have_account, probation_end_date, probation_start_date } = filter
    return Employees.count({
      where: {
        [Op.or]: [
          {
            full_name: { [Op.like]: "%" + search + "%" },
          },
        ],
        ...((probation_start_date && probation_end_date) && {
          probation_start_date: { [Op.between]: [probation_start_date, probation_end_date] },
          probation_end_date: { [Op.between]: [probation_start_date, probation_end_date] },
        }),
        ...(status && { employee_status: { [Op.like]: "%" + status + "%" } }),
        ...(division_id && { division_id }),
      },
      include: [
        {
          model: EmployeeAccount,
          required: have_account ? true : false
        }
      ]
    });
  }

  async getByUserId(user_id) {
    return Employees.findAll({
      where: { user_id }
    })
  }

  async getEmployeesPage(filter, offset, limit) {
    let { search, division_id, status, have_account, sort_name, probation_start_date, probation_end_date } = filter
    sort_name = sort_name === "1" ? true : false
    return Employees.findAll({
      where: {
        ...(status && { employee_status: { [Op.like]: "%" + status + "%" } }),
        ...(division_id && { division_id }),
        ...((probation_start_date && probation_end_date) && {
          probation_start_date: { [Op.between]: [probation_start_date, probation_end_date] },
          probation_end_date: { [Op.between]: [probation_start_date, probation_end_date] },
        }),
        ...(search && {
          [Op.or]: [
            {
              employee_no: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              full_name: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              gender: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              religion: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              marital_status: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              last_education: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              is_education: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              major: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              employee_status: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              occupation: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              duty: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              job_desc: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              grade: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        })
      },
      include: [
        {
          model: EmployeeAccount,
          required: have_account ? true : false
        },
        {
          model: User,
          attributes: ["full_name", "email", "id"],
          required: false
        }
      ],
      offset: offset,
      limit: limit,
      ...(sort_name ? {
        order: [["full_name", "ASC"]]
      } : {
        order: [["id", "DESC"]],
      })
    });
  }

  async getDetail(id) {
    return Employees.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["full_name", "email", "id", 'avatar'],
          required: false
        },
        {
          model: EmployeeAttachment,
          required: false
        },
        {
          model: FormPosistion,
          include: [
            {
              model: EmployeePosition
            }
          ],
          required: false
        },
        {
          model: EmployeeSignature,
          required: false
        },
        {
          model: Training,
          required: false
        }
      ]
    })
  }

  async getGradeRecap() {
    return Employees.findAll({
      attributes: ["grade", [sequelize.fn("COUNT", "grade"), "total_data"]],
      group: ["grade"]
    })
  }

  async getStatusRecap() {
    return Employees.findAll({
      attributes: ["employee_status", [sequelize.fn("COUNT", "employee_status"), "total_data"]],
      group: ["employee_status"]
    })
  }

  async getDivisionRecap() {
    return Employees.findAll({
      include: { model: Division, attributes: [] },
      attributes: ["division_id", [sequelize.col('division.name'), "name"], [sequelize.fn("COUNT", sequelize.col("division_id")), "total_data"]],
      group: ["division_id"]
    })
  }

  async getOnlyId(where) {
    const employeeData = await Employees.findAll({
      where, attributes: ['id']
    })
    if (employeeData.length < 1) return false
    return employeeData.map(employee => employee.id);
  }

  getMe(id) {
    return Employees.findOne({
      where: { id },
      include: [
        {
          model: EmployeeAttendance,
          required: false
        }
      ]
    })
  }

  async getEmployeeForEvaluation(filter, month_id) {
    const { division_id } = filter
    return Employees.findAll({
      where: { division_id, current_evaluation_id: null },
      include: [
        {
          model: EmployeeEvaluation,
          required: false,
          where: {
            month_start: month_id,
          },
        },
      ],
    })
  }

}
module.exports = EmployeesDao;
