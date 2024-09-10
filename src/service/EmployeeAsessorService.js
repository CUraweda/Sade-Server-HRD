const httpStatus = require("http-status");
const EmployeeAsessorDao = require("../dao/EmployeeAsessorDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeAsessorService {
    constructor() {
        this.employeeAsessorDao = new EmployeeAsessorDao();
    }

    update = async (id, body) => {
        const dataExist = await this.employeeAsessorDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Tidak Ada");

        const positionData = await this.employeeAsessorDao.updateWhere(body, { id });
        if (!positionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Asessor Berhasil diperbaharui", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeAsessorDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeAsessorDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Asessor Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    }
}

module.exports = EmployeeAsessorService;
