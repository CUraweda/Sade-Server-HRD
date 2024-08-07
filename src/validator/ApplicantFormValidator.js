const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class ApplicantFormValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            vacancy_id: Joi.number().required(),
            user_id: Joi.number().required(),
            full_name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
            nik: Joi.string().required(),
            pob: Joi.string().required(),
            dob: Joi.date().required(),
            religion: Joi.string().required(),
            martial_status: Joi.string().required(),
            address: Joi.string().required(),
            city: Joi.string().required(),
            applicant_description: Joi.string().required(),
            applicant_vision: Joi.string().required(),
            applicant_reason: Joi.string().required(),
            applicant_question: Joi.string().required(),
            status: Joi.string().required(),
            is_passed: Joi.boolean().required(),
            file_path: Joi.string().required()
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
