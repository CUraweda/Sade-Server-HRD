const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class TrainingAttendanceValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            training_id: Joi.number().integer(),
            title: Joi.string(),
            files: Joi.any(),
            description: Joi.string(),
            day_id: Joi.number().integer()
        });

        const options = { abortEarly: false, allowUnknown: true, stripUnknown: true };
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            const errorMessage = error.details.map((details) => { return details.message }).join(", ");
            next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        } else {
            req.body = value;
            return next();
        }
    }
}

module.exports = TrainingAttendanceValidator;
