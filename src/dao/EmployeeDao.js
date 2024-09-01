const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize")

const Employees = models.employees;
const User = models.user
const EmployeeAttendance = models.employeeattendance
const EmployeeVacation = models.employeevacation
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
    const { isGuru, search, isAssign, division_id } = filter
    return Employees.count({
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
        ...(division_id && { division_id }),
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
            pob: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            dob: {
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
            certificate_year: {
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
            work_start_date: {
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
      },
    });
  }

  async getByUserId(user_id) {
    return Employees.findAll({
      where: { user_id }
    })
  }

  async getEmployeesPage(filter, offset, limit) {
    const { isGuru, search, isAssign, division_id } = filter
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
        ...(division_id && { division_id }),
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
            pob: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            dob: {
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
            certificate_year: {
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
            work_start_date: {
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
      },
      include: [
        {
          model: User,
        }
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
  }

  async getDetail(id){
    return Employees.findOne({
      where: { id },
      include: [
        {
          model: EmployeeAttachment,
          required: false
        },
        {
          model: FormPosistion,
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
