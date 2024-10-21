const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class JobVacancyValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            title: Joi.string(),
            sub_title: Joi.string(),
            min_academic: Joi.string(),
            location: Joi.string(),
            longitude: Joi.string(),
            latitude: Joi.string(),
            start_date: Joi.date(),
            end_date: Joi.date(),
            notes: Joi.string().optional(),
            status: Joi.string(),
            role: Joi.valid("GURU", "KARYAWAN"),
            division_id: Joi.number(),
            is_fulltime: Joi.boolean(),
            is_open: Joi.boolean()
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

    async createWithDetailValidator(req, res, next) {
        const schema = Joi.object({
            title: Joi.string(),
            sub_title: Joi.string(),
            min_academic: Joi.string(),
            location: Joi.string(),
            longitude: Joi.string(),
            latitude: Joi.string(),
            start_date: Joi.date(),
            end_date: Joi.date(),
            notes: Joi.string().optional(),
            status: Joi.string(),
            role: Joi.valid("GURU", "KARYAWAN"),
            division_id: Joi.number(),
            is_fulltime: Joi.boolean(),
            is_open: Joi.boolean(),
            details: Joi.array()
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

    async closeVacancyValidator(req, res, next) {
        const schema = Joi.object({
            notes: Joi.string(),
            status: Joi.string(),
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

module.exports = JobVacancyValidator;
