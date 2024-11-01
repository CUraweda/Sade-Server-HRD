const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class FormPositionValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            position_id: Joi.number().integer(),
            employee_id: Joi.number().integer(),
            is_active: Joi.boolean()
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

module.exports = FormPositionValidator;
