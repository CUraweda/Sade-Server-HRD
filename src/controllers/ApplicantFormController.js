const httpStatus = require("http-status");
const ApplicantFormService = require("../service/ApplicantFormService");

class ApplicantFormController {
    constructor() {
        this.applicantFormService = new ApplicantFormService();
    }

    getAll = async (req, res) => {
        try {
            const page = +req.query.page || 0;
            const limit = +req.query.limit || 10;
            const { search } = req.query;

            const offset = limit * page;
            const resData = await this.applicantFormService.showPage(page, limit, offset, { search });

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
            const resData = await this.applicantFormService.showOne(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getDetail = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
            const resData = await this.applicantFormService.showDetail(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    getRekapDashboard = async (req, res) => {
        try {
            const resData = await this.applicantFormService.showRekapDashboard()

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    getByVacancy = async (req, res) => {
        try {
            const id = +req.params.id;
            let { search, is_passed_interview, is_passed } = req.query
            if(is_passed_interview) is_passed_interview = is_passed_interview != "1" ? false : true
            if(is_passed) is_passed = is_passed != "1" ? false : true
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong Sertakan ID");
            const resData = await this.applicantFormService.showByVacancy(id, { search, is_passed_interview, is_passed })

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    createOne = async (req, res) => {
        try {
            const resData = await this.applicantFormService.create(req.body);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    sendData = async (req, res) => {
        const { file_desc, details } = req.body
        try {
            if (req.files) {
                for (let descIndex in file_desc) {
                    const { Identifier, index } = file_desc[descIndex]
                    const fileData = req.files[descIndex]
                    if (!req.files[descIndex]) continue
                    switch (Identifier) {
                        case "applicant_profile":
                            req.body.file_path = fileData.path
                            break;
                        case "appreciation":
                            const { appreciation } = details
                            if (!appreciation || !appreciation[index]) continue
                            if (!appreciation[index].files) appreciation[index].files = []
                            appreciation[index].files.push(fileData)
                            break;
                        default:
                            continue
                    }
                }
                delete req.body.file_desc
            }
            const resData = await this.applicantFormService.createDataAndDetail(req.body)

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    evaluateFirst = async (req, res) => {
        try {
            const id = +req.params.id
            const { condition } = req.params
            const { employee } = req.user
            const resData = await this.applicantFormService.createInterview(req.body, id, condition, employee)
            
            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    }

    evaluateSecond = async (req, res) => {
        try {
            const id = +req.params.id
            const { condition } = req.params
            const { employee } = req.user
            const resData = await this.applicantFormService.createSecondEvalution(id, condition, req.body, employee)

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    }

    update = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Please provide an ID");
            const resData = await this.applicantFormService.update(id, req.body);

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
            const resData = await this.applicantFormService.delete(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = ApplicantFormController;
