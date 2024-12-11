const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeEvaluationItemValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            division_id: Joi.number().required(),
            name: Joi.string().required(),
            description: Joi.string().required(),
            grading_id: Joi.number().integer().required(),
            unit_id: Joi.number().required(),
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

module.exports = EmployeeEvaluationItemValidator;
