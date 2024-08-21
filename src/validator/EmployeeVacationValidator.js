const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeVacationValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            employee_id: Joi.number().integer(),
            approver_id: Joi.number().integer(),
            type: Joi.valid("CUTI", "IZIN"),
            status: Joi.valid("Menunggu", "Disetujui", "Tidak Disetujui"),
            description: Joi.string().optional(),
            is_approved: Joi.boolean(),
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

    async requestVacationValidator(req, res, next) {
        const schema = Joi.object({
            type: Joi.valid("CUTI", "IZIN"),
            status: Joi.valid("Menunggu"),
            description: Joi.string(),
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

    async changeVacationValidator(req, res, next) {
        const schema = Joi.object({
            description: Joi.string(),
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
}

module.exports = EmployeeVacationValidator;
