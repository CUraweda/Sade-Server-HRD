const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeBillValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            account_id: Joi.number().integer(),
            type_id: Joi.number().integer(),
            description: Joi.string(),
            amount: Joi.number().precision(2)
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

    async addValidator(req, res, next) {
        const schema = Joi.object({
            employee_id: Joi.number().integer(),
            type_id: Joi.number().integer().required(),
            description: Joi.string(),
            amount: Joi.number().precision(2).required()
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

module.exports = EmployeeBillValidator;
