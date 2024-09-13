const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize")

const Employees = models.employees;
const User = models.user
const EmployeeAttendance = models.employeeattendance
const EmployeeVacation = models.employeevacation
const EmployeePosition = models.employeeposition
const EmployeeAttachment = models.employeeattachment
const FormPosistion = models.formposition
const Training = models.training
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
    const { isGuru, search, isAssign, division_id, status } = filter
    console.log(search)
    return Employees.count({
      where: {
        [Op.or]: [
          {
            full_name: { [Op.like]: "%" + search + "%" },
          },
        ],
        ...(isGuru && { is_teacher: isGuru }),
        ...(isAssign && {
          user_id: {
            ...(isAssign != "N" ? {
              [Op.not]: null
            } : {
              [Op.is]: null
            })
          }
        }),
        ...(status && { employee_status: status }),
        ...(division_id && { division_id }),
      },
    });
  }

  async getByUserId(user_id) {
    return Employees.findAll({
      where: { user_id }
    })
  }

  async getEmployeesPage(filter, offset, limit) {
    const { isGuru, search, isAssign, division_id, status } = filter
    return Employees.findAll({
      where: {
        ...(isGuru && { is_teacher: isGuru }),
        ...(isAssign && {
          user_id: {
            ...(isAssign != "N" ? {
              [Op.not]: null
            } : {
              [Op.is]: null
            })
          }
        }),
        ...(status && { employee_status: status }),
        ...(division_id && { division_id }),
        [Op.and ]: [
          {
            full_name: {
              [Op.like]: "%" + search + "%",
            },
          }
        ],
      },
      include: [
        {
          model: User,
          required: false
        }
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }

  async getDetail(id) {
    return Employees.findOne({
      where: { id },
      include: [
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
          model: Training,
          required: false
        }
      ]
    })
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

}
module.exports = EmployeesDao;
