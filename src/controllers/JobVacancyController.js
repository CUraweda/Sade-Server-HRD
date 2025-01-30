const httpStatus = require("http-status");
const JobVacancyService = require("../service/JobVacancyService");

class JobVacancyController {
    constructor() {
        this.jobVacancyService = new JobVacancyService();
    }

    getAll = async (req, res) => {
        try {
            const page = +req.query.page  || 0;
            const limit = +req.query.limit || 10;
            const { search, division_id, only_open, user_id } = req.query;

            const offset = limit * page;
            const resData = await this.jobVacancyService.showPage(
                page,
                limit,
                offset,
                { search, division_id, only_open, user_id }
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
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
            const resData = await this.jobVacancyService.showOne(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
    
    getRecapDivision = async (req, res) => {
        try{
            const resData = await this.jobVacancyService.showDivisionRecap()
            
            res.status(resData.statusCode).send(resData.response);
        }catch(e){
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    createOne = async (req, res) => {
        try {
            const resData = await this.jobVacancyService.create(req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createWithDetail = async (req, res) => {
        try {
            const resData = await this.jobVacancyService.createWithDetail(req.body)

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    closeVacancy = async (req, res) => {
        try {
            const { id } = req.params
            const resData = await this.jobVacancyService.updateClose(id, req.body)

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    update = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
            const resData = await this.jobVacancyService.update(id, req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    };

    delete = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
            const resData = await this.jobVacancyService.delete(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = JobVacancyController;
