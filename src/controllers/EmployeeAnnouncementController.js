const httpStatus = require("http-status");
const EmployeeAnnouncementService = require("../service/EmployeeAnnouncementService");

class EmployeeAnnouncementController {
    constructor() {
        this.employeeAnnouncementService = new EmployeeAnnouncementService();
    }

    getAll = async (req, res) => {
        try {
            const page = +req.query.page || 0;
            const limit = +req.query.limit || 10;
            let { search, only_specific, employee_id } = req.query;
            if (only_specific === "1") employee_id = req.user?.employee?.id

            const offset = limit * page;
            let resData = await this.employeeAnnouncementService.showPage(
                page,
                limit,
                offset,
                { search }
            );

            if (employee_id) {
                const resDataSpecific = await this.employeeAnnouncementService.showPage(
                    page,
                    limit,
                    offset,
                    { search }
                )
                resData.response.data.result  = [...resData.response.data.result, ...resDataSpecific.response.data.result]
                resData.response.data.totalRows += resDataSpecific.response.data.totalRows
            }
            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getOne = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong sertakan ID");
            const resData = await this.employeeAnnouncementService.showOne(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createOne = async (req, res) => {
        try {
            const resData = await this.employeeAnnouncementService.create(req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    update = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong sertakan ID");
            const resData = await this.employeeAnnouncementService.update(id, req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    };

    delete = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong sertakan ID");
            const resData = await this.employeeAnnouncementService.delete(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = EmployeeAnnouncementController;
