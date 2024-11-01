const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class ApplicantAcademicValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            form_id: Joi.number(),
            degree: Joi.string(),
            city: Joi.string(),
            institution: Joi.string(),
            major: Joi.string(),
            description: Joi.string().optional(),
            is_kuliah: Joi.boolean(),
            start_date: Joi.date(),
            end_date: Joi.date().optional()
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

module.exports = ApplicantAcademicValidator;
