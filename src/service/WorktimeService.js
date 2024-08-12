const httpStatus = require("http-status");
const WorktimeDao = require("../dao/WorktimeDao");
const responseHandler = require("../helper/responseHandler");

class WorktimeService {
    constructor() {
        this.worktimeDao = new WorktimeDao();
    }

    create = async (body) => {
        const worktimeData = await this.worktimeDao.create(body);
        if (!worktimeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Worktime Gagal dibuat");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Worktime Berhasil dibuat", worktimeData);
    };

    upsertUID = async (body = { uid: undefined }) => {
        const worktimeData = await this.worktimeDao.updateOrCreate(body, { uid: body.uid })
        if (!worktimeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Worktime Gagal dibuat")

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Worktime Berhasil dibuat", worktimeData)
    }

    update = async (id, body) => {
        const dataExist = await this.worktimeDao.findById(id);
        if (!dataExist) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Worktime Tidak Ada");

        const worktimeData = await this.worktimeDao.updateWhere(body, { id });
        if (!worktimeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Worktime Gagal diperbaharui");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Worktime Berhasil diperbaharui", {});
    };

    delete = async (id) => {
        const worktimeData = await this.worktimeDao.deleteByWhere({ id });
        if (!worktimeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Worktime Gagal dihapus");

        return responseHandler.returnSuccess(httpStatus.CREATED, "Data Worktime Berhasil dihapus", {});
    };

    showPage = async (page, limit, offset, filter) => {
        const totalRows = await this.worktimeDao.getCount(filter);
        const totalPage = Math.ceil(totalRows / limit);

        const result = await this.worktimeDao.getPage(offset, limit, filter);

        return responseHandler.returnSuccess(httpStatus.OK, "Data Worktime Berhasil diambil",
            {
                result, page, limit,
                totalRows: totalRows,
                totalPage: totalPage,
            }
        );
    };

    showOne = async (id) => {
        const worktimeData = await this.worktimeDao.findById(id);
        if (!worktimeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Worktime Tidak ditemukan");

        return responseHandler.returnSuccess(httpStatus.OK, "Data Worktime Ditemukan", worktimeData);
    };

    showByUID = async (uid) => {
        const worktimeData = await this.worktimeDao.getByUID(uid)
        if (!worktimeData) return responseHandler.returnError(httpStatus.BAD_REQUEST, "Data Worktime Tidak Ditemukan")
        return responseHandler.returnSuccess(httpStatus.OK, "Data Worktime Ditemukan", worktimeData)
    }
}

module.exports = WorktimeService;
