const httpStatus = require("http-status");
const EmployeeJobdeskDao = require("../dao/EmployeeJobdeskDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeJobdeskService {
    constructor() {
        this.employeeJobdeskDao = new EmployeeJobdeskDao();
    }

    create = async (body) => {
        const employeeJobdeskData = await this.employeeJobdeskDao.create(body);
        if (!employeeJobdeskData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Jobdesk Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Jobdesk Berhasil dibuat", employeeJobdeskData);
    };

    update = async (id, body) => {
        const dataExist = await this.employeeJobdeskDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Jobdesk Tidak Ada");

        const employeeJobdeskData = await this.employeeJobdeskDao.updateWhere(body, { id });
        if (!employeeJobdeskData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Jobdesk Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Jobdesk Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const employeeJobdeskData = await this.employeeJobdeskDao.deleteByWhere({ id });
        if (!employeeJobdeskData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Jobdesk Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Jobdesk Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeJobdeskDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeJobdeskDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Jobdesk Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const employeeJobdeskData = await this.employeeJobdeskDao.findById(id);
        if (!employeeJobdeskData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Jobdesk Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Jobdesk Ditemukan", employeeJobdeskData);
    };
}

module.exports = EmployeeJobdeskService;
