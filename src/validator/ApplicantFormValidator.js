const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");
const { reconstructDetails } = require("../middlewares/desctucture");

class ApplicantFormValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            vacancy_id: Joi.number(),
            user_id: Joi.number(),
            full_name: Joi.string(),
            email: Joi.string(),
            phone: Joi.string(),
            nik: Joi.string(),
            pob: Joi.string(),
            dob: Joi.date(),
            religion: Joi.string(),
            martial_status: Joi.string(),
            address: Joi.string(),
            city: Joi.string(),
            applicant_description: Joi.string(),
            applicant_vision: Joi.string(),
            applicant_reason: Joi.string(),
            applicant_question: Joi.string(),
            status: Joi.string(),
            is_passed: Joi.boolean(),
            file_path: Joi.string()
        });

        const options = { abortEarly: false, allowUnknown: true, stripUnknown: true };
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(", ");
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            req.body = value;
            return next();
        }
    }

    async sendFormValidator(req, res, next) {
        const schema = Joi.object({
            vacancy_id: Joi.number(),
            user_id: Joi.number(),
            full_name: Joi.string(),
            email: Joi.string(),
            phone: Joi.string(),
            nik: Joi.string(),
            pob: Joi.string(),
            dob: Joi.date(),
            religion: Joi.string(),
            martial_status: Joi.string(),
            address: Joi.string(),
            city: Joi.string(),
            applicant_description: Joi.string(),
            applicant_vision: Joi.string(),
            applicant_reason: Joi.string(),
            applicant_question: Joi.string(),
            details: Joi.object({
                academic: Joi.array(),
                job: Joi.array(),
                unformal: Joi.array(),
                appreciation: Joi.array(),
                skill: Joi.array()
            }),
            files_desc: Joi.array().items(Joi.object({
                identifier: Joi.string(),
                identifierIndex: Joi.number()
            }))
        });

        const options = { abortEarly: false, allowUnknown: true, stripUnknown: true };
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(", ");
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            req.body = value;
            return next();
        }
    }

    async evaluateInterviewValidator(req, res, next){
        const schema = Joi.object({
            plan_date: Joi.date(),
            portal: Joi.string()
        });

        const options = { abortEarly: false, allowUnknown: true, stripUnknown: true };
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(", ");
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            req.body = value;
            return next();
        }
    }
}

module.exports = ApplicantFormValidator;
