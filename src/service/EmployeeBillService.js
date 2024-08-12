const httpStatus = require("http-status");
const EmployeeBillDao = require("../dao/EmployeeBillDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeBillService {
    constructor() {
        this.employeeBillDao = new EmployeeBillDao();
    }

    create = async (body) => {
        const employeeBillData = await this.employeeBillDao.create(body);
        if (!employeeBillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Bill data could not be created");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Employee Bill data successfully created", employeeBillData);
    };

    update = async (id, body) => {
        const dataExist = await this.employeeBillDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Bill data not found");

        const employeeBillData = await this.employeeBillDao.updateWhere(body, { id });
        if (!employeeBillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Bill data could not be updated");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee Bill data successfully updated", {});
    }

    delete = async (id) => {
        const employeeBillData = await this.employeeBillDao.deleteByWhere({ id });
        if (!employeeBillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Bill data could not be deleted");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee Bill data successfully deleted", {});
    }

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeBillDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeBillDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Employee Bill data successfully retrieved", {
            result, page, limit,
            totalRows: totalRows,
            totalPage: totalPage,
        });
    }

    showOne = async (id) => {
        const employeeBillData = await this.employeeBillDao.findById(id);
        if (!employeeBillData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee Bill data not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee Bill data found", employeeBillData);
    }
}

module.exports = EmployeeBillService;
