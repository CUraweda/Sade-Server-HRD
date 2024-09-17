const httpStatus = require("http-status");
const EmployeeDao = require("../dao/EmployeeDao");
const UserDao = require("../dao/UserDao");
const responseHandler = require("../helper/responseHandler");
const { response } = require("express");
const EmailHelper = require("../helper/EmailHelper");

class EmployeeService {
  constructor() {
    this.employeeDao = new EmployeeDao();
    this.userDao = new UserDao()
    this.emailHelper = new EmailHelper();
  }

  createEmployee = async (reqBody) => {
    try {
      let message = "Employee successfully added.";

      let data = await this.employeeDao.create(reqBody);

      if (!data) {
        message = "Failed to add employee.";
        return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
      }

      return responseHandler.returnSuccess(httpStatus.CREATED, message, data);
    } catch (e) {
      console.log(e)
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Something went wrong!"
      );
    }
  };

  updateEmployee = async (id, body) => {
    const message = "Employee successfully updated!";

    let dt = await this.employeeDao.findById(id);

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Employee not found!",
        {}
      );
    }

    if (body.user_id) {
      const alreadyTaken = await this.employeeDao.getByUserId(body.user_id)
      if (alreadyTaken.length > 0) return responseHandler.returnError(httpStatus.OK, "User already taken")
    }

    const updateData = await this.employeeDao.updateWhere(body, { id });

    if (updateData) {
      return responseHandler.returnSuccess(httpStatus.OK, message, {});
    }
  };

  actionProbation = async (condition, id, employee) => {
    if (!id) return responseHandler.returnError(httpStatus.BAD_REQUEST, "ID is required")
    if (!employee)
      return responseHandler.returnError(
        httpStatus.BAD_REQUEST,
        "Anda tidak termasuk karyawan"
      );
    const employeeData = await this.employeeDao.findById(id)
    if (!employeeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Not Found")
    if (!employeeData.still_in_probation) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee already finish the probation")
    let userPayload = {}, employeePayload = {}
    switch (condition) {
      case "SUCCESS":
        // userPayload = { role_id: 11 }
        employeePayload = { still_in_probation: false, probation_end_date: new Date(), employee_status: "Kontrak" }

        // Send email for success condition
        await this.emailHelper.sendApplicantEmail(
          {
            //applicant
            applicantName: employeeData.full_name,
            applicantEmail: employeeData.email,
            applicantEmployee: employeeData.full_name,
            applicantMajor: employeeData.major,

            //sender
            senderName: employee.full_name,
            senderPosition: employee.occupation,
            senderEmail: employee.email,
            senderPhone: employee.phone,
          },
          applicationExist.email,
          'Kontrak Kerja - Sekolah Alam Depok',
          '../views/applicant_success2.html'
        );
        break;
      case "FAIL":
        userPayload = { role_id: 11 }
        employeePayload = { still_in_probation: false, probation_end_date: new Date(), user_id: null, employee_status: "Diberhentikan" }

        // Send email for fail condition
        await this.emailHelper.sendApplicantEmail(
          {
            startDate: employeeData.work_start_date,
            endDate: new Date(),
            reason: '{{reason}}',
            //applicant
            applicantName: employeeData.full_name,
            applicantAddress: employeeData.address || '{{address}}',
            applicantPhone: employeeData.phone,
            applicantEmail: employeeData.email,
            //sender
            senderName: employee.full_name,
            senderPosition: employee.occupation,
          },
          applicationExist.email,
          'Hasil Masa Percobaan Magang - Sekolah Alam Depok',
          '../views/applicant_error2.html'
        );
        break;
      default:
        break;
    }

    const updateEmployee = await this.employeeDao.updateById(employeePayload, id)
    if (!updateEmployee) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update employee data")
    const updateUser = await this.userDao.updateById(userPayload, employeeData.user_id)
    if (!updateUser) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update user data")

    return responseHandler.returnSuccess(httpStatus.OK, "Succesfully finish the action", {});
  };

  showEmployee = async (id) => {
    const message = "Employee successfully retrieved!";

    let dt = await this.employeeDao.findById(id);

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Employee not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };

  showByUser = async (data) => {
    if (!data.employee) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda tidak termasuk kedalam Karyawan")
    const { id } = data.employee
    const employeeData = await this.employeeDao.getMe(id)
    if (!employeeData) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda tidak termasuk kedalam Karyawan")

    return responseHandler.returnSuccess(httpStatus.OK, "Data Me berhasil  didapatkan", employeeData)
  }

  showEmployeeIsGuru = async (isGuru) => {
    const message = "Employee successfully retrieved!";

    let dt = await this.employeeDao.getEmployeeByIsTeacher(isGuru);

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Employee not found!",
        {}
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };

  showDetail = async (id) => {
    if (!id) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Please Provide an Id");

    const employeeData = await this.employeeDao.getDetail(id)
    if (!employeeData) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Data Employee TIdak Ditemukan")

    return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Berhasil Diambil", employeeData);
  }

  async showPage(page, limit, filter, offset) {
    const totalRows = await this.employeeDao.getCount(filter);
    const totalPage = Math.ceil(totalRows / limit);

    const result = await this.employeeDao.getEmployeesPage(
      filter,
      offset,
      limit
    );

    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Employee successfully retrieved.",
      {
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      }
    );
  }

  deleteEmployee = async (id) => {
    const message = "Employee successfully deleted!";

    let dt = await this.employeeDao.deleteByWhere({ id });

    if (!dt) {
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Employee not found!"
      );
    }

    return responseHandler.returnSuccess(httpStatus.OK, message, dt);
  };
}

module.exports = EmployeeService;
