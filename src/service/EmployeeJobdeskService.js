const httpStatus = require("http-status");
const EmployeeJobdeskDao = require("../dao/EmployeeJobdeskDao");
const responseHandler = require("../helper/responseHandler");
const constant = require("../config/constant");

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

    updateFinish = async (id, employee) => {
        if (!employee) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Anda tidak termasuk sebagai karyawan");
        const dataExist = await this.employeeJobdeskDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Jobdesk Tidak Ada");
        if (dataExist.employee_id != employee.id) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Jobdesk tidak ditujukan untuk anda");

        const payload = {
            is_finish: true,
            finished_at: new Date()
        }
        const employeeJobdeskData = await this.employeeJobdeskDao.updateWhere(payload, { id });
        if (!employeeJobdeskData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Jobdesk Gagal diperbaharui");
    
        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Jobdesk Berhasil diperbaharui", {});
    }

    updateGrade = async (id, employee, grade) => {
        if (!employee) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Anda tidak termasuk sebagai karyawan");
        const dataExist = await this.employeeJobdeskDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Jobdesk Tidak Ada");
        if (!dataExist.is_finish) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Jobdesk belum selesai dikerjakan");

        const payload = {
            grader_id: employee.id,
            graded_at: new Date(),
            is_graded: true, grade
        }
        const employeeJobdeskData = await this.employeeJobdeskDao.updateWhere(payload, { id });
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



    showRecapWeekEID = async (employee_id) => {
        const weekObject = {}
        constant.weekList.forEach((week, i) => { weekObject[i] = { name: week, raw_grade: 0, graded: 0 } })

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

        const employeeJobdeskData = await this.employeeJobdeskDao.getStartEnd(startOfWeek, endOfWeek, { employee_id, is_graded: true })
        if (!employeeJobdeskData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Tidak ditemukan");

        for (let jobdesk of employeeJobdeskData) {
            const dayIndex = jobdesk.finished_at.getDay()
            if (weekObject[dayIndex]) {
                weekObject[dayIndex].raw_grade += jobdesk.grade
                weekObject[dayIndex].graded++
            }
        }

        return responseHandler.returnSuccess(httpStatus.OK, "Rekap Monthly berhasil didapatkan", Object.values(weekObject))
    }

    showRecapMonhEID = async (employee_id) => {
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth().toString().padStart(2, "0")
        const currentYear = currentDate.getFullYear()
        const startDate = `01-${currentMonth}-${currentYear}T00:00:00.000Z`
        const employeeJobdeskData = await this.employeeJobdeskDao.getStartEnd(startDate, currentDate.toISOString(), { employee_id })
        if (!employeeJobdeskData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Rekap Monthly berhasil didapatkan", employeeJobdeskData)
    }

    showRecapYearEID = async (employee_id) => {
        const monthObject = {}
        constant.monthList.forEach((month, i) => { monthObject[i] = { name: month, total: 0, sum_grade: 0 } })

        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const startDate = `01-01-${currentYear}T00:00:00.000Z`
        const employeeJobdeskData = await this.employeeJobdeskDao.getStartEnd(startDate, currentDate.toISOString(), { employee_id })
        if (!employeeJobdeskData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Attendance Tidak ditemukan");

        employeeJobdeskData.forEach((jobdesk) => {
            const monthIndex = jobdesk.createdAt.getMonth()
            if (monthObject[monthIndex]) {
                monthObject[monthIndex].total++
                monthObject[monthIndex].sum_grade += jobdesk.grade
            }
        })

        return responseHandler.returnSuccess(httpStatus.OK, "Rekap Monthly berhasil didapatkan", monthObject)
    }

    showOne = async (id) => {
        const employeeJobdeskData = await this.employeeJobdeskDao.findById(id);
        if (!employeeJobdeskData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Jobdesk Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Jobdesk Ditemukan", employeeJobdeskData);
    };
}

module.exports = EmployeeJobdeskService;
