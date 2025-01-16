const httpStatus = require("http-status");
const constant = require('../config/constant')
const EmployeeAttendanceDao = require("../dao/EmployeeAttendanceDao");
const EmployeeVacationDao = require("../dao/EmployeeVacationDao");
const responseHandler = require("../helper/responseHandler");
const WorktimeDao = require("../dao/WorktimeDao");
const EmployeesDao = require("../dao/EmployeeDao");
const EmployeeOutstationDao = require("../dao/EmployeeOutstationDao");

class EmployeeAttendanceService {
    constructor() {
        this.employeeAttendanceDao = new EmployeeAttendanceDao();
        this.employeeDao = new EmployeesDao()
        this.worktimeDao = new WorktimeDao()
        this.outstationDao = new EmployeeOutstationDao()
        this.employeeVacationDao = new EmployeeVacationDao()
    }

    formatWorkhour = (milliseconds) => {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60)); // hours
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60)); // minutes
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000); // seconds

        return { hours, minutes, seconds }
    };

    formatUID = (currentDate, worktime_id, employee_id) => {
        const date = new Date(currentDate).toISOString().split('T')[0]
        return `${date}|${worktime_id}|${employee_id}`
    }

    formatStatus = (worktime) => {
        const currentTime = new Date()
        const offset = currentTime.getTimezoneOffset() * 60000
        const localCurrentTime = new Date(currentTime.getTime() - offset)

        const currentDate = localCurrentTime.toISOString().split("T")[0]
        const startTime = new Date(`${currentDate}T${worktime.start_time}Z`); // WIB timezone
        const endTime = new Date(`${currentDate}T${worktime.end_time}Z`);   // WIB timezone
        let status;

        switch (true) {
            case (localCurrentTime >= startTime && localCurrentTime <= endTime):
                status = "Tepat Waktu";
                break;
            case (localCurrentTime < startTime):
                status = "Terlalu Cepat";
                break;
            case (localCurrentTime > endTime):
                status = "Terlambat";
                break;
            default:
                status = null;
        }

        return { status };
    }

    checkOutstation = async (employee) => {
        const { active_outstation_id, id } = employee
        const currentTime = new Date()
        const offset = currentTime.getTimezoneOffset() * 60000
        const localCurrentTime = new Date(currentTime.getTime() - offset)

        const outstationExist = await this.outstationDao.findById(active_outstation_id)
        const moreThanEndDate = !outstationExist?.end_date ? false : localCurrentTime > new Date(outstationExist.end_date) ? true : false
        if (!outstationExist || moreThanEndDate) {
            await this.employeeDao.updateById({ is_outstation: false, active_outstation_id: null }, id)
            return { is_outstation: false, outstation_id: null }
        }

        return { is_outstation: true, outstation_id: active_outstation_id }
    }

    updateEmployeeWorkhour = async (employee, attendance_masuk, worktime_keluar) => {
        let { raw_workhour, id } = employee;
        const currentTime = new Date()
        const offset = currentTime.getTimezoneOffset() * 60000
        const localCurrentTime = new Date(currentTime.getTime() - offset)
        const currentDate = localCurrentTime.toISOString().split("T")[0]

        const masukDate = new Date(attendance_masuk.createdAt);
        const keluarDate = this.formatStatus(worktime_keluar) === "Terlambat" ? new Date(`${currentDate}T${worktime_keluar.end_time}Z`) : new Date();

        const diffInMs = keluarDate - masukDate;
        raw_workhour = raw_workhour + diffInMs
        const updatedEmployee = await this.employeeDao.updateById({ raw_workhour }, id)
        return { updatedEmployee, diffInMs }
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

    createByOrder = async (employee, file) => {
        if (!employee) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda tidak terdaftar sebagai karyawan")
        const { division_id } = employee

        if (!division_id) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda tidak terdaftar pada divisi apapun")
        const { outstation_id, is_outstation } = await this.checkOutstation(employee)
        // if (is_outstation && !file) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda sedang Dinas Luar, mohon sertakan gambar")

        const currentTime = new Date()
        const endTime = `${currentTime.toISOString().split('T')[0]}T23:59:59.999Z`
        const checkVacation = await this.employeeVacationDao.getApprovedFromRange(currentTime.toISOString(), endTime)
        if (checkVacation.length > 0) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Employee sedang dalam masa cuti")

        let worktimeData = await this.worktimeDao.getUnfinishTodayOrder(employee, currentTime)
        let masukWorktimeData = {}, attendance_time_differences = 0

        if (worktimeData.length < 1) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Tidak ada jadwal yang bisa diambil")
        for (let checkWorktime of worktimeData) {
            if (checkWorktime.type === "MASUK" && checkWorktime.employeeattendances.length > 0) masukWorktimeData = checkWorktime.employeeattendances[0]
            if (checkWorktime.employeeattendances.length < 1) {
                worktimeData = checkWorktime
                break
            }
        }
        if (Array.isArray(worktimeData)) return responseHandler.returnError(httpStatus.UNPROCESSABLE_ENTITY, "Anda sudah memenuhi absensi hari ini")
        if (worktimeData.type === "KELUAR") {
            const { diffInMs } = await this.updateEmployeeWorkhour(employee, masukWorktimeData, worktimeData)
            attendance_time_differences = diffInMs
        }
        const uid = this.formatUID(currentTime, worktimeData.id, employee.id)
        const checkAlreadyExist = await this.employeeAttendanceDao.getByUID(uid)
        if (checkAlreadyExist) return responseHandler.returnSuccess(httpStatus.OK, `Data Employee Attendance ${worktimeData.type} Hari Ini sudah dibuat`)

        const { status } = this.formatStatus(worktimeData)
        const attendanceData = await this.employeeAttendanceDao.create({
            worktime_id: worktimeData.id,
            description: constant.attendDescription,
            ...(file && { file_path: file.path }),
            status, uid, attendance_time_differences, outstation_id, employee_id: employee.id, is_outstation: employee.is_outstation
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
        const attendanceData = await this.employeeAttendanceDao.deleteAndReduceWorkhour(id);
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance / Data Update Gagal dieksekusi");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Attendance Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        let { date, start_date, end_date, iteration } = filter
        if ((iteration && date) || (start_date && end_date)) {
            start_date = new Date(start_date)
            end_date = new Date(end_date)

            if (date){
                start_date = new Date(date)
                end_date = new Date(date)
            }
            switch (iteration) {
                case "week":
                    const dayOfWeek = start_date.getDay();
                    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
                    start_date.setDate(start_date.getDate() + diffToMonday);
                    start_date.setHours(0, 0, 0, 0);
                    end_date = new Date(start_date);
                    end_date.setDate(start_date.getDate() + 6);
                    end_date.setHours(23, 59, 59, 999);
                    break;

                case "month":
                    start_date.setDate(1);
                    start_date.setHours(0, 0, 0, 0);
                    end_date = new Date(start_date);
                    end_date.setMonth(start_date.getMonth() + 1);
                    end_date.setDate(0);
                    end_date.setHours(23, 59, 59, 999);
                    break;
                default:
                    start_date.setHours(0, 0, 0, 0);
                    end_date.setHours(23, 59, 59, 999);
                    break
            }
            filter.date = { start_date, end_date }
        }
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

    showRekapStatus = async (filter) => {
        let { start_date, end_date } = filter
        if (start_date && end_date) {
            start_date = new Date(start_date)
            end_date = new Date(end_date)
            start_date.setHours(0, 0, 0, 0);
            end_date.setHours(23, 59, 59, 999);
            filter.date = { start_date, end_date }
        }
        const attendanceData = await this.employeeAttendanceDao.getDataStatus(filter)
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Tidak ditemukan");
        
        let statusData = {}
        for (let resultData of attendanceData) {
            const { status } = resultData
            if (!statusData[status]) statusData[status] = 0
            statusData[status]++
        }

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Attendance Ditemukan", statusData);
    }

    showTotalWorktime = async (filter) => {
        let { month, year } = filter
        const currentDate = new Date()
        if (!month) month = (currentDate.getMonth() + 1).toString()
        if (!year) year = currentDate.getFullYear()

        const startDate = `${year}-${month.padStart(2, "0")}-01T00:00:00.000Z`
        let attendanceData = await this.employeeAttendanceDao.totalAttendanceWorktimeRange(startDate, currentDate)
        attendanceData = attendanceData[0]
        let { total_worktime } = attendanceData.dataValues
        total_worktime = total_worktime != null ? this.formatWorkhour(total_worktime) : { hours: 0, minutes: 0, seconds: 0 }
        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Attendance Ditemukan", { total_worktime });

    }

    showRekapWeek = async (employee_id) => {
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
        return responseHandler.returnSuccess(httpStatus.OK, "Rekap Weekly berhasil didapatkan", Object.values(weekObject))
    }

    showRekapMonth = async (employee_id) => {
        const currentDate = new Date()
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0")
        const currentYear = currentDate.getFullYear()
        const startDate = `${currentYear}-${currentMonth}-01T00:00:00.000Z`
        const attendanceData = await this.employeeAttendanceDao.countAttendanceStartEnd(employee_id, startDate, currentDate.toISOString())
        const vacationData = await this.employeeVacationDao.getRekapByStartEnd(startDate, currentDate.toISOString(), { employee_id, type: ["CUTI", "IZIN"] })
        if (!vacationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Vacation Tidak ditemukan");

        let counter = { IZIN: 0, CUTI: 0 }
        vacationData.map((vacation) => { counter[vacation.type] = counter[vacation.type] + vacation.day_differences })

        return responseHandler.returnSuccess(httpStatus.OK, "Rekap Monthly berhasil didapatkan", { HADIR: attendanceData || 0, ...counter })
    }

    showRekapMonthAllEmployee = async () => {
        const currentDate = new Date()
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0")
        const currentYear = currentDate.getFullYear()
        const startDate = `${currentYear}-${currentMonth}-01T00:00:00.000Z`
        const attendanceData = await this.employeeAttendanceDao.getAttendanceRecap(startDate, currentDate.toISOString())
        if (!attendanceData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Rekap Monthly Employee berhasil didapatkan", attendanceData)
    }

    showRekapYear = async (employee_id) => {
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
                    break; j
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
}

module.exports = EmployeeAttendanceService;
