const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeAttendanceValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            worktime_id: Joi.number().integer().required(),
            employee_id: Joi.number().integer().required(),
            uid: Joi.string().required(),
            description: Joi.string().optional(),
            status: Joi.string().required(),
            is_outstation: Joi.boolean().required()
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

module.exports = EmployeeAttendanceValidator;
