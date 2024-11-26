const httpStatus = require("http-status");
const EmployeeEvaluationItemDao = require("../dao/EmployeeEvaluationItemDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeEvaluationItemService {
    constructor() {
        this.employeeEvaluationItemDao = new EmployeeEvaluationItemDao();
    }

    create = async (body) => {
        const employeeEvaluationItemData = await this.employeeEvaluationItemDao.create(body);
        if (!employeeEvaluationItemData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create employee evaluation item");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Employee evaluation item created successfully", employeeEvaluationItemData);
    };

    createMany = async (body = []) => {
        const employeeEvaluationItemData = await this.employeeEvaluationItemDao.bulkCreate(body);
        if (!employeeEvaluationItemData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to create employee evaluation items");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Employee evaluation items created successfully", employeeEvaluationItemData);
    };

    update = async (id, body) => {
        const dataExist = await this.employeeEvaluationItemDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee evaluation item not found");

        const employeeEvaluationItemData = await this.employeeEvaluationItemDao.updateWhere(body, { id });
        if (!employeeEvaluationItemData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to update employee evaluation item");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluation item updated successfully", {});
    };

    delete = async (id) => {
        const employeeEvaluationItemData = await this.employeeEvaluationItemDao.deleteByWhere({ id });
        if (!employeeEvaluationItemData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Failed to delete employee evaluation item");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluation item deleted successfully", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeEvaluationItemDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeEvaluationItemDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluation items retrieved successfully", {
            result,
            page,
            limit,
            totalRows,
            totalPage,
        });
    };

    showOne = async (id) => {
        const employeeEvaluationItemData = await this.employeeEvaluationItemDao.findById(id);
        if (!employeeEvaluationItemData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Employee evaluation item not found");

        return responseHandler.returnSuccess(httpStatus.OK, "Employee evaluation item found", employeeEvaluationItemData);
    };
}

module.exports = EmployeeEvaluationItemService;
