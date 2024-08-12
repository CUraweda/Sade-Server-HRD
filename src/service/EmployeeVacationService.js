const httpStatus = require("http-status");
const EmployeeVacationDao = require("../dao/EmployeeVacationDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeVacationService {
    constructor() {
        this.employeeVacationDao = new EmployeeVacationDao();
    }

    create = async (body) => {
        const employeeVacationData = await this.employeeVacationDao.create(body);
        if (!employeeVacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Vacation Berhasil dibuat", employeeVacationData);
    };

    update = async (id, body) => {
        const dataExist = await this.employeeVacationDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Tidak Ada");

        const employeeVacationData = await this.employeeVacationDao.updateWhere(body, { id });
        if (!employeeVacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Vacation Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const employeeVacationData = await this.employeeVacationDao.deleteByWhere({ id });
        if (!employeeVacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Vacation Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeVacationDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeVacationDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Vacation Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const employeeVacationData = await this.employeeVacationDao.findById(id);
        if (!employeeVacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Vacation Ditemukan", employeeVacationData);
    };
}

module.exports = EmployeeVacationService;
