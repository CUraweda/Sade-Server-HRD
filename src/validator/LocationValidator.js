const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeAccountValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            lat: Joi.number(),
            lng: Joi.number(),
            radius: Joi.number(),
            nama: Joi.string()
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
