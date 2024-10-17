const httpStatus = require("http-status");
const EmployeeVacationDao = require("../dao/EmployeeVacationDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeVacationService {
    constructor() {
        this.employeeVacationDao = new EmployeeVacationDao();
    }

    countDaysBetween(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const timeDifference = end - start;
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        return daysDifference;
    }

    create = async (body) => {
        const { start_date, end_date } = body
        body.day_differences = this.countDaysBetween(start_date, end_date)
        const employeeVacationData = await this.employeeVacationDao.create(body);
        if (!employeeVacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Vacation Berhasil dibuat", employeeVacationData);
    };

    createRequestOne = async (employee, body) => {
        const { start_date, end_date } = body
        if (!employee) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Tidak ditemukan data employee");
        const day_differences = this.countDaysBetween(start_date, end_date)
        const employeeVacationData = await this.employeeVacationDao.create({
            ...body,
            day_differences,
            employee_id: employee.id
        });
        if (!employeeVacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Vacation Berhasil dibuat", employeeVacationData);
    }

    changeStatus = async (id, condition, essential) => {
        const { employee } = essential
        if (!employee) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Anda tidak termasuk sebagai Karyawan");
        const dataExist = await this.employeeVacationDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Tidak Ada");

        const body = condition.toLowerCase() === "accept" ? {
            is_approved: true,
            approver_id: employee.id,
            status: "Diterima"
        } : { is_approved: false, status: "Ditolak" }

        const employeeVacationData = await this.employeeVacationDao.updateWhere(body, { id });
        if (!employeeVacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Vacation Berhasil diperbaharui", {});
    }

    change = async (id, body) => {
        const dataExist = await this.employeeVacationDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Tidak Ada");
        if (dataExist.is_approved) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Tidak bisa dirubah");

        const employeeVacationData = await this.employeeVacationDao.updateWhere(body, { id });
        if (!employeeVacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Vacation Berhasil diperbaharui", {});
    }

    update = async (id, body) => {
        const dataExist = await this.employeeVacationDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Tidak Ada");

        const employeeVacationData = await this.employeeVacationDao.updateWhere(body, { id });
        if (!employeeVacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Vacation Berhasil diperbaharui", {});
    };

    removeData = async (id) => {
        const dataExist = await this.employeeVacationDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Tidak Ada");
        if (dataExist.is_approved) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Tidak bisa dihapus");

        const employeeVacationData = await this.employeeVacationDao.deleteByWhere({ id });
        if (!employeeVacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Vacation Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Vacation Berhasil dihapus", {});
    }

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
