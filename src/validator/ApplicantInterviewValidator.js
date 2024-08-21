const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class ApplicantInterviewValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            form_id: Joi.number(),
            interviewer_id: Joi.number(),
            plan_date: Joi.date(),
            is_finish: Joi.boolean(),
            outcome: Joi.valid("LULUS", "TIDAK LULUS"),
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

module.exports = ApplicantInterviewValidator;
