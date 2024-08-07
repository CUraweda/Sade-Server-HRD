const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeAccountValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            salary_id: Joi.number().integer(),
            employee_id: Joi.number().integer(),
            month_id: Joi.number().integer(),
            year: Joi.number().integer(),
            uid: Joi.string(),
            status: Joi.string(),
            is_paid: Joi.boolean(),
            temp_total: Joi.number(),
            fixed_salary: Joi.number(),
            variable_salary: Joi.number(),
            loan: Joi.number(),
            cooperative: Joi.number()
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

module.exports = EmployeeAccountValidator;
