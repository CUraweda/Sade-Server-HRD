const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class JobdeskGradeValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            name: Joi.string().required(),
            grade: Joi.string().required(),
            indicator: Joi.number().integer().required(),
            group_id: Joi.number().required(),
            group_uid: Joi.string().required(),
            indicator_uid: Joi.string().required(),
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

module.exports = JobdeskGradeValidator;
