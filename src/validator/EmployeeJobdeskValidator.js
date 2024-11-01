const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeJobdeskValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            employee_id: Joi.number().integer(),
            name: Joi.string(),
            asessor_ids: Joi.string(),
            description: Joi.string().optional(),
            due_date: Joi.date(),
            priority: Joi.number().integer().optional(),
            priority_label: Joi.string().optional(),
            grade: Joi.number().integer().optional(),
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
    async createBulkValidator(req, res, next) {
        const schema = Joi.object({
            employee_ids: Joi.array(),
            asessor_ids: Joi.array(),
            name: Joi.string(),
            description: Joi.string().optional(),
            due_date: Joi.date(),
            priority: Joi.number().integer().optional(),
            priority_label: Joi.string().optional(),
            grade: Joi.number().integer().optional(),
            all_employee: Joi.bool().default(false),
            all_assesor: Joi.bool().default(false)
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
    async gradingValidator(req, res, next) {
        const schema = Joi.object({
            grade: Joi.number().integer()
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
    async gradeValidator(req, res, next) {
        const schema = Joi.object({
            grade: Joi.number().integer().required()
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

module.exports = EmployeeJobdeskValidator;
