const httpStatus = require("http-status");
const EmployeePositionDao = require("../dao/EmployeePositionDao");
const responseHandler = require("../helper/responseHandler");

class EmployeePositionService {
    constructor() {
        this.employeePositionDao = new EmployeePositionDao();
    }

    create = async (body) => {
        const positionData = await this.employeePositionDao.create(body);
        if (!positionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Position Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Position Berhasil dibuat", positionData);
    };

    update = async (id, body) => {
        const dataExist = await this.employeePositionDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Position Tidak Ada");

        const positionData = await this.employeePositionDao.updateWhere(body, { id });
        if (!positionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Position Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Position Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const positionData = await this.employeePositionDao.deleteByWhere({ id });
        if (!positionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Position Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Position Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeePositionDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeePositionDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Position Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const positionData = await this.employeePositionDao.findById(id);
        if (!positionData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Position Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Position Ditemukan", positionData);
    };
}

module.exports = EmployeePositionService;
