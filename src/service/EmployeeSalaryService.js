const httpStatus = require("http-status");
const EmployeeSalaryDao = require("../dao/EmployeeSalaryDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeSalaryService {
    constructor() {
        this.employeeSalaryDao = new EmployeeSalaryDao();
    }

    create = async (body) => {
        const employeeSalaryData = await this.employeeSalaryDao.create(body);
        if (!employeeSalaryData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Salary Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Salary Berhasil dibuat", employeeSalaryData);
    };

    update = async (id, body) => {
        const dataExist = await this.employeeSalaryDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Salary Tidak Ada");

        const employeeSalaryData = await this.employeeSalaryDao.updateWhere(body, { id });
        if (!employeeSalaryData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Salary Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Salary Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const employeeSalaryData = await this.employeeSalaryDao.deleteByWhere({ id });
        if (!employeeSalaryData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Salary Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Salary Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeSalaryDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeSalaryDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Salary Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const employeeSalaryData = await this.employeeSalaryDao.findById(id);
        if (!employeeSalaryData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Salary Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Salary Ditemukan", employeeSalaryData);
    };
}

module.exports = EmployeeSalaryService;
