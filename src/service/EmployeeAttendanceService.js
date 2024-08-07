const httpStatus = require("http-status");
const EmployeeAttendanceDao = require("../dao/EmployeeAttendanceDao");
const responseHandler = require("../helper/responseHandler");

class EmployeeAttendanceService {
    constructor() {
        this.employeeAttendanceDao = new EmployeeAttendanceDao();
    }

    create = async (body) => {
        const attendanceData = await this.employeeAttendanceDao.create(body);
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Attendance Berhasil dibuat", attendanceData);
    };

    update = async (id, body) => {
        const dataExist = await this.employeeAttendanceDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Tidak Ada");

        const attendanceData = await this.employeeAttendanceDao.updateWhere(body, { id });
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Attendance Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const attendanceData = await this.employeeAttendanceDao.deleteByWhere({ id });
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Attendance Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeAttendanceDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeAttendanceDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Attendance Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const attendanceData = await this.employeeAttendanceDao.findById(id);
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Attendance Ditemukan", attendanceData);
    };
}

module.exports = EmployeeAttendanceService;
