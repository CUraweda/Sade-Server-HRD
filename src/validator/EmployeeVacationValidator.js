const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeVacationValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            employee_id: Joi.number().integer().required(),
            approver_id: Joi.number().integer().required(),
            type: Joi.string().required(),
            status: Joi.string().required(),
            description: Joi.string().optional(),
            is_approved: Joi.boolean().required(),
            start_date: Joi.date().required(),
            end_date: Joi.date().required(),
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

module.exports = EmployeeVacationValidator;
