const httpStatus = require("http-status");
const EmployeeOutstationDao = require("../dao/EmployeeOutstationDao");
const EmployeeDao = require("../dao/EmployeeDao")
const responseHandler = require("../helper/responseHandler");

class EmployeeOutstationService {
    constructor() {
        this.employeeOutstationDao = new EmployeeOutstationDao();
        this.employeeDao = new EmployeeDao()
    }

    attachEmployeeActive = async (employee_id, outstation_id) => {
        const updatedEmployee = await this.employeeDao.updateById({ is_outstation: true, active_outstation_id: outstation_id }, employee_id)
        if (!updatedEmployee) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Gagal dirubah untuk menyesuaikan Outstation");

        await this.employeeOutstationDao.unActiveAllExcept(outstation_id)
        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Berhasil dirubah", updatedEmployee);
    }

    attachEmployeeUnactive = async (employee_id) => {
        const updatedEmployee = await this.employeeDao.updateById({ is_outstation: false, active_outstation_id: null }, employee_id)
        if (!updatedEmployee) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Gagal dirubah untuk menyesuaikan Outstation");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Berhasil dirubah", updatedEmployee);
    }

    create = async (body) => {
        const outstationData = await this.employeeOutstationDao.create(body);
        if (!outstationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Outstation Gagal dibuat");
        await this.attachEmployeeActive(outstationData.employee_id, outstationData.id)

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Outstation Berhasil dibuat", outstationData);
    };

    update = async (id, body) => {
        const dataExist = await this.employeeOutstationDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Outstation Tidak Ada");
        
        const outstationData = await this.employeeOutstationDao.updateWhere(body, { id });
        if (!outstationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Outstation Gagal diperbaharui");
        await this.attachEmployeeActive(dataExist.employee_id, id)

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Outstation Berhasil diperbaharui", {});
    };
    
    delete = async (id) => {
        const dataExist = await this.employeeOutstationDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Outstation Tidak Ada");    

        const outstationData = await this.employeeOutstationDao.deleteByWhere({ id });
        if (!outstationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Outstation Gagal dihapus");
        await this.attachEmployeeUnactive(dataExist.employee_id)

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Outstation Berhasil dihapus", {});
    };
    
    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeOutstationDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeOutstationDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Outstation Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const outstationData = await this.employeeOutstationDao.findById(id);
        if (!outstationData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Outstation Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Outstation Ditemukan", outstationData);
    };
}

module.exports = EmployeeOutstationService;
