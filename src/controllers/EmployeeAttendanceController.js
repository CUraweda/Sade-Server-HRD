const httpStatus = require("http-status");
const constant = require('../config/constant')
const EmployeeAttendanceService = require("../service/EmployeeAttendanceService");
const WorktimeService = require("../service/WorktimeService");
const ApiError = require("../helper/ApiError");

class EmployeeAttendanceController {
    constructor() {
        this.employeeAttendanceService = new EmployeeAttendanceService();
        this.worktimeService = new WorktimeService()
    }

    getAll = async (req, res) => {
        try {
            const page = +req.query.page || 0;
            const limit = +req.query.limit || 10;
            const { search } = req.query;

            const offset = limit * page;
            const resData = await this.employeeAttendanceService.showPage(
                page,
                limit,
                offset,
                { search }
            );

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getOne = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id){

                return res.status(httpStatus.UNPROCESSABLE_ENTITY).send("ID Diperlukan")
            } 
            const resData = await this.employeeAttendanceService.showOne(id);
            
            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createByToken = async (req, res) => {
        try {
            if(!req.user.employee) return res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Anda tidak terdaftar sebagai Employee")
            const { division_id } = req.user.employee
            if (!division_id) return res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Anda belum terdaftar pada divisi apapun, tolong beritahukan admin");
            const resData = await this.employeeAttendanceService.createByClosest(division_id, req.user.employee, req.file)

            res.status(resData.statusCode).send(resData.response)
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    createOne = async (req, res) => {
        try {
            const resData = await this.employeeAttendanceService.create(req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    update = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus["422_CLASS"]).send("Tolong sertakan ID");
            const resData = await this.employeeAttendanceService.update(id, req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    };

    delete = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus["422_CLASS"]).send("Tolong sertakan ID");
            const resData = await this.employeeAttendanceService.delete(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = EmployeeAttendanceController;
