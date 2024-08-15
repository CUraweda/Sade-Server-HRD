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
            if (!id) res.status(httpStatus["422_CLASS"]).send("Please provide an ID");
            const resData = await this.applicantFormService.showOne(id);
            
            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
    
    getByVacancy = async (req, res) => {
        try{
            const id = +req.params.id;
            if (!id) res.status(httpStatus.UNPROCESSABLE_ENTITY).send("Tolong Sertakan ID");
            const resData = await this.applicantFormService.showByVacancy(id)

            res.status(resData.statusCode).send(resData.response);
        }catch(e){
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
        const { files_desc, details } = req.body
        try {
            if (req.files) {
                for (descIndex in files_desc) {
                    const { identifier, identifierIndex } = files_desc[descIndex]
                    if (!req.files[descIndex]) continue
                    const fileData = req.files[descIndex]
                    switch (identifier) {
                        case "applicant_profile":
                            req.body.file_path = fileData.path
                            break;
                        case "appreciation":
                            const { appreciation } = details
                            if (!appreciation || !appreciation[identifierIndex]) continue
                            if(!appreciation[identifierIndex].files) appreciation[identifierIndex].files = []
                            appreciation[identifierIndex].files.push(fileData)
                            break;
                        default:
                            continue
                    }
                }
                delete req.body.files_desc
            }
            const resData = await this.applicantFormService.createDataAndDetail(req.body)

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    evaluateInterview = async (req, res) => {
        try{
            const id = +req.params.id
            const resData = await this.applicantFormService.createInterview(req.body, id)
        }catch(e){
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send({ error: e.message });
        }
    }

    update = async (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) res.status(httpStatus["422_CLASS"]).send("Please provide an ID");
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
            if (!id) res.status(httpStatus["422_CLASS"]).send("Please provide an ID");
            const resData = await this.applicantFormService.delete(id);

            res.status(resData.statusCode).send(resData.response);
        } catch (e) {
            console.log(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = ApplicantFormController;
