const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class TrainingSuggestionValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            employee_id: Joi.number().integer(),
            approver_id: Joi.number().integer(),
            title: Joi.string(),
            notes: Joi.string(),
            start_date: Joi.date(),
            end_date: Joi.date(),
            is_approved: Joi.boolean(),
            location: Joi.string()
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

    async requestValidator(req, res, next) {
        const schema = Joi.object({
            title: Joi.string(),
            notes: Joi.string(),
            location: Joi.string(),
            start_date: Joi.date(),
            end_date: Joi.date(),
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
    async approveValidator(req, res, next) {
        const schema = Joi.object({
            is_approved: Joi.boolean().required(),
            purpouse: Joi.string().optional()
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

module.exports = TrainingSuggestionValidator;
