const httpStatus = require("http-status");
const EmployeeAnnouncementDao = require("../dao/EmployeeAnnouncementDao");
const responseHandler = require("../helper/responseHandler");
const FormAnnouncementDao = require("../dao/FormAnnouncementDao");

class EmployeeAnnouncementService {
    constructor() {
        this.employeeAnnouncementDao = new EmployeeAnnouncementDao();
        this.formAnnouncementDao = new FormAnnouncementDao()
    }

    create = async (body) => {
        const { is_specific, employee_ids } = body 
        if(is_specific && (!employee_ids || employee_ids?.length < 1)) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Pengumuman Spesifik, namun tidak ada karyawan yang dituju");
        const employeeAnnouncementData = await this.employeeAnnouncementDao.create(body);
        if (!employeeAnnouncementData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Announcement Gagal dibuat");
        
        if(is_specific){
            const datas = []
            for(let employee_id of employee_ids){ datas.push({ employee_id, announcement_id: employeeAnnouncementData.id }) }
            const formAnnouncementData = await this.formAnnouncementDao.bulkCreate(datas)
            if (!formAnnouncementData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Form Announcement Gagal dibuat");
        }

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Announcement Berhasil dibuat", employeeAnnouncementData);
    };

    update = async (id, body) => {
        const dataExist = await this.employeeAnnouncementDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Announcement Tidak Ada");

        const employeeAnnouncementData = await this.employeeAnnouncementDao.updateWhere(body, { id });
        if (!employeeAnnouncementData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Announcement Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Announcement Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const employeeAnnouncementData = await this.employeeAnnouncementDao.deleteByWhere({ id });
        if (!employeeAnnouncementData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Announcement Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Employee Announcement Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.employeeAnnouncementDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.employeeAnnouncementDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Announcement Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };
    
    showOne = async (id) => {
        const employeeAnnouncementData = await this.employeeAnnouncementDao.findById(id);
        if (!employeeAnnouncementData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Employee Announcement Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Employee Announcement Ditemukan", employeeAnnouncementData);
    };
}

module.exports = EmployeeAnnouncementService;
