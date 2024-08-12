const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class JobVacancyValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            title: Joi.string().required(),
            sub_title: Joi.string().required(),
            min_academic: Joi.string().required(),
            location: Joi.string().required(),
            longitude: Joi.string().required(),
            latitude: Joi.string().required(),
            start_date: Joi.date().required(),
            end_date: Joi.date().required(),
            max_applicant: Joi.number().required(),
            applicant_count: Joi.number().required(),
            notes: Joi.string().required(),
            status: Joi.string().required(),
            role: Joi.string().required(),
            division_id: Joi.number().required(),
            is_fulltime: Joi.boolean().required(),
            is_open: Joi.boolean().required()
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

module.exports = JobVacancyValidator;
