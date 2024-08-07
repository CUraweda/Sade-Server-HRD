const httpStatus = require("http-status");
const EmployeeAccountDao = require("../dao/EmployeeAccountDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeAccountService {
    constructor() {
        this.employeeAccountDao = new EmployeeAccountDao();
    }

    create = async (body) => {
        const employeeAccountData = await this.employeeAccountDao.create(body);
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data could not be created");

        return responseHandler.returnSuccess(httpStatus.CREATED, "EmployeeAccount data successfully created", employeeAccountData);
    };

    update = async (id, body) => {
        const dataExist = await this.employeeAccountDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data not found");

        const employeeAccountData = await this.employeeAccountDao.updateWhere(body, { id });
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data could not be updated");

        return responseHandler.returnSuccess(httpStatus.OK, "EmployeeAccount data successfully updated", {});
    }

    delete = async (id) => {
        const employeeAccountData = await this.employeeAccountDao.deleteByWhere({ id });
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data could not be deleted");

        return responseHandler.returnSuccess(httpStatus.OK, "EmployeeAccount data successfully deleted", {});
    }

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeAccountDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeAccountDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "EmployeeAccount data successfully retrieved", {
            result, page, limit,
            totalRows: totalRows,
            totalPage: totalPage,
        });
    }

    showOne = async (id) => {
        const employeeAccountData = await this.employeeAccountDao.findById(id);
        if (!employeeAccountData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "EmployeeAccount data not found");

        return responseHandler.returnSuccess(httpStatus.OK, "EmployeeAccount data found", employeeAccountData);
    }
}

module.exports = EmployeeAccountService;
