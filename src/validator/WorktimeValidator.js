const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class WorktimeValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            division_id: Joi.number().integer().required(),
            weekday_id: Joi.number().integer().required(),
            uid: Joi.string().required(),
            type: Joi.string().valid('MASUK', 'KELUAR').required(),
            start_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/).optional(),
            end_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/).optional()
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

    async upsertValidator(req, res, next) {
        const schema = Joi.object({
            division_id: Joi.number().integer().required(),
            weekday_id: Joi.number().integer().required(),
            type: Joi.string().valid('MASUK', 'KELUAR').required(),
            start_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/).optional(),
            end_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/).optional()
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

module.exports = WorktimeValidator;
