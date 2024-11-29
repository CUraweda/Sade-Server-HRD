const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeEvaluationValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            employee_id: Joi.number().required(),
            month_start: Joi.number().required(),
            month_end: Joi.number().required(),
            academic_year: Joi.string().required(),
            uid: Joi.string().required(),
            is_done: Joi.boolean(),
            file_path: Joi.string(),
            division_id: Joi.number().required(),
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

module.exports = EmployeeEvaluationValidator;
