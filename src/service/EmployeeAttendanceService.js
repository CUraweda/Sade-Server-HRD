const httpStatus = require("http-status");
const constant = require('../config/constant')
const EmployeeAttendanceDao = require("../dao/EmployeeAttendanceDao");
const responseHandler = require("../helper/responseHandler");
const WorktimeDao = require("../dao/WorktimeDao");

class EmployeeAttendanceService {
    constructor() {
        this.employeeAttendanceDao = new EmployeeAttendanceDao();
        this.worktimeDao = new WorktimeDao()
        this.emp
    }

    create = async (body) => {
        const attendanceData = await this.employeeAttendanceDao.create(body);
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Attendance Berhasil dibuat", attendanceData);
    };

    createByClosest = async (employee, file) => {
        if (!employee) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda tidak terdaftar sebagai karyawan")
        const { division_id, is_outstation } = employee
        if (!division_id) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda tidak terdaftar pada divisi apapun")
        if (is_outstation && !file) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda sedang Dinas Luar, mohon sertakan gambar")
        
        const currentTime = new Date()
        const { closestWorktime } = await this.worktimeDao.getShortestTime(employee.division_id)

        const uid = this.formatUID(currentTime, closestWorktime.id, employee.id)
        const checkAlreadyExist = await this.employeeAttendanceDao.getByUID(uid)
        if (checkAlreadyExist) return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Attendance Hari Ini sudah dibuat")

        const { status } = this.formatStatus(closestWorktime)
        const attendanceData = await this.employeeAttendanceDao.create({
            worktime_id: closestWorktime.id,
            description: constant.attendDescription,
            ...(file && { file_path: file.path }),
            status, uid, employee_id: employee.id, is_outstation: employee.is_outstation
        })
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Attendance Berhasil dibuat", attendanceData);
    }

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

    showByUID = async (uid) => {
        const attendanceData = await this.employeeAttendanceDao.findOneByWhere({ uid });
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Attendance Ditemukan", attendanceData);
    }

    showRekapEID = async (id) => {
        
    }
    showOne = async (id) => {
        const attendanceData = await this.employeeAttendanceDao.findById(id);
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Attendance Ditemukan", attendanceData);
    };

    formatUID = (currentDate, worktime_id, employee_id) => {
        const date = new Date(currentDate).toISOString().split('T')[0]
        return `${date}|${worktime_id}|${employee_id}`
    }

    formatStatus = (worktime) => {
        const currentTime = new Date()
        const startTime = new Date(`1970-01-01T${worktime.start_time}Z`);
        const endTime = new Date(`1970-01-01T${worktime.end_time}Z`);
        let status;

        switch (true) {
            case (currentTime >= startTime && currentTime <= endTime):
                status = "Tepat Waktu";
                break;
            case (currentTime < startTime):
                status = "Terlalu Cepat";
                break;
            case (currentTime > endTime):
                status = "Terlambat";
                break;
            default:
                status = null;
        }

        return { status };
    }
}

module.exports = EmployeeAttendanceService;
