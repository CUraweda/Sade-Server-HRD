const httpStatus = require("http-status");
const EmployeeDao = require("../dao/EmployeeDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeService {
  constructor() {
    this.employeeDao = new EmployeeDao();
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
    if(!employeeData) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda tidak termasuk kedalam Karyawan")

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

  async showPage(page, limit, filter, offset) {
    const totalRows = await this.employeeDao.getCount(filter.search);
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
