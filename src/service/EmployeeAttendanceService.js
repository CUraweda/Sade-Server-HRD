const httpStatus = require("http-status");
const constant = require('../config/constant')
const EmployeeAttendanceDao = require("../dao/EmployeeAttendanceDao");
const EmployeeVacationDao = require("../dao/EmployeeVacationDao");
const responseHandler = require("../helper/responseHandler");
const WorktimeDao = require("../dao/WorktimeDao");

class EmployeeAttendanceService {
    constructor() {
        this.employeeAttendanceDao = new EmployeeAttendanceDao();
        this.worktimeDao = new WorktimeDao()
        this.employeeVacationDao = new EmployeeVacationDao()
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

    showRekapWeekEID = async (employee_id) => {
        const weekObject = {}
        constant.weekList.forEach((week, i) => { weekObject[i] = { name: week, hadir: 0, cuti: 0, izin: 0 } })

        const today = new Date();
        const dayOfWeek = today.getDay();
        let startOfWeek = new Date(today);
        let endOfWeek = new Date(today);
    
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust start of the week based on Sunday
        startOfWeek.setDate(diff);
        startOfWeek = startOfWeek.toISOString().split('T')[0] + "T00:00:00.000Z"
    
        const daysToAdd = 5 - dayOfWeek + (dayOfWeek === 0 ? 7 : 0); // Adjust end of the week based on Friday
        endOfWeek.setDate(today.getDate() + daysToAdd);
        endOfWeek = endOfWeek.toISOString().split('T')[0] + "T23:59:59.999Z"
    
        const attendanceData = await this.employeeAttendanceDao.getByRange(startOfWeek, endOfWeek, { employee_id })
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Tidak ditemukan");

        const vacationData = await this.employeeVacationDao.getRekapByStartEnd(startOfWeek, endOfWeek, { employee_id, type: ["CUTI", "IZIN"] })
        if (!vacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Vacation Tidak ditemukan");

        for (let attendance of attendanceData) {
            const dayIndex = attendance.createdAt.getDay()
            console.log(dayIndex)
            console.log(attendance.createdAt)
            if (weekObject[dayIndex]) weekObject[dayIndex].hadir++
        }
        for (let vacation of vacationData) {
            const dayIndex = vacation.start_date.getDay()
            switch (vacation.type) {
                case "CUTI":
                    if (weekObject[dayIndex]) weekObject[dayIndex].cuti++
                    break;
                case "IZIN":
                    if (weekObject[dayIndex]) weekObject[dayIndex].izin++
                    break;
                default:
                    break;
            }
        }
        return responseHandler.returnSuccess(httpStatus.OK, "Rekap Weekly berhasil didapatkan", weekObject)
    }

    showRekapMonthEID = async (employee_id) => {
        const currentDate = new Date()
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0")
        const currentYear = currentDate.getFullYear()
        const startDate = `${currentYear}-${currentMonth}-01T00:00:00.000Z`
        const attendanceData = await this.employeeAttendanceDao.countAttendanceStartEnd(employee_id, startDate, currentDate.toISOString())
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Tidak ditemukan");

        const vacationData = await this.employeeVacationDao.getRekapByStartEnd(startDate, currentDate.toISOString(), { employee_id, type: ["CUTI", "IZIN"] })
        if (!vacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Vacation Tidak ditemukan");

        let counter = { IZIN: 0, CUTI: 0 }
        vacationData.map((vacation) => { counter[vacation.type]++ })

        return responseHandler.returnSuccess(httpStatus.OK, "Rekap Monthly berhasil didapatkan", { HADIR: attendanceData, ...counter })
    }

    showRekapYearEID = async (employee_id) => {
        const monthObject = {}
        constant.monthList.forEach((month, i) => { monthObject[i] = { name: month, cuti: 0, izin: 0, hadir: 0 } })

        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const startDate = `01-01-${currentYear}T00:00:00.000Z`
        const attendanceData = await this.employeeAttendanceDao.getByRange(startDate, currentDate.toISOString(), { employee_id })
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Tidak ditemukan");

        const vacationData = await this.employeeVacationDao.getRekapByStartEnd(startDate, currentDate.toISOString(), { employee_id, type: ["CUTI", "IZIN"] })
        if (!vacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Vacation Tidak ditemukan");

        for (let attendance of attendanceData) {
            const monthIndex = attendance.createdAt.getMonth()
            if (monthObject[monthIndex]) monthObject[monthIndex].hadir++
        }
        for (let vacation of vacationData) {
            const monthIndex = vacation.start_date.getMonth()
            switch (vacation.type) {
                case "CUTI":
                    if (monthObject[monthIndex]) monthObject[monthIndex].cuti++
                    break;
                case "IZIN":
                    if (monthObject[monthIndex]) monthObject[monthIndex].izin++
                    break;
                default:
                    break;j
            }
        }

        return responseHandler.returnSuccess(httpStatus.OK, "Rekap Yearly berhasil didapatkan", monthObject)
    }

    showRecapCalendar = async (employee, start_date, end_date) => {
        if (!employee) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda tidak terdaftar sebagai karyawan")

        const attendances = await this.employeeAttendanceDao.getPage(undefined, undefined, { employee_id: employee.id, start_date, end_date })
        const vacations = await this.employeeVacationDao.getPage(undefined, undefined, { employee_id: employee.id, start_date, end_date })

        const data = [
            ...attendances.map(att => ({
                id: att.id,
                type: "PRESENSI",
                title: att.worktime?.type ?? "HADIR",
                start_date: att.created_at,
                end_date: att.created_at,
                is_outstation: att.is_outstation,
                is_late: false
            })),
            ...vacations.map(vac => ({
                id: vac.id,
                type: vac.type ?? "CUTI/IZIN",
                title: vac.type ?? "CUTI/IZIN",
                start_date: vac.start_date,
                end_date: vac.end_date,
            }))
        ]

        return responseHandler.returnSuccess(httpStatus.OK, "Rekap kehadiran berhasil didapatkan", data)
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
