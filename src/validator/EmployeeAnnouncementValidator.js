const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeAnnouncementValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            title: Joi.string(),
            plan_date: Joi.date(),
            notes: Joi.string(),
            is_specific: Joi.boolean().required(),
            employee_ids: Joi.array()
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

module.exports = EmployeeAnnouncementValidator;
