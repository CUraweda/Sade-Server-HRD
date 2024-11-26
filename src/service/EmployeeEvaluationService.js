const httpStatus = require("http-status");
const EmployeeEvaluationDao = require("../dao/EmployeeEvaluationDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeEvaluationService {
    constructor() {
        this.employeeEvaluationDao = new EmployeeEvaluationDao();
    }

    create = async (body) => {
        const employeeEvaluationData = await this.employeeEvaluationDao.create(body);
        if (!employeeEvaluationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create employee evaluation");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Employee evaluation created successfully", employeeEvaluationData);
    };

    createMany = async (body = []) => {
        const employeeEvaluationData = await this.employeeEvaluationDao.bulkCreate(body);
        if (!employeeEvaluationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create employee evaluations");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Employee evaluations created successfully", employeeEvaluationData);
    };

    update = async (id, body) => {
        const dataExist = await this.employeeEvaluationDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee evaluation not found");

        const employeeEvaluationData = await this.employeeEvaluationDao.updateWhere(body, { id });
        if (!employeeEvaluationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update employee evaluation");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluation updated successfully", {});
    };

    delete = async (id) => {
        const employeeEvaluationData = await this.employeeEvaluationDao.deleteByWhere({ id });
        if (!employeeEvaluationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete employee evaluation");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluation deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeEvaluationDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeEvaluationDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluations retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const employeeEvaluationData = await this.employeeEvaluationDao.findById(id);
        if (!employeeEvaluationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee evaluation not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluation found", employeeEvaluationData);
    };
}

module.exports = EmployeeEvaluationService;
