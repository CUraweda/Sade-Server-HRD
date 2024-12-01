const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeJobdeskValidator {
    async createUpdateValidator(req, res, next) {
        const schema = Joi.object({
            employee_id: Joi.number(),
            grader_id: Joi.number(),
            partner_id: Joi.number(),
            name: Joi.string(),
            description: Joi.string(),
            asessor_ids: Joi.string().required(),
            partner_ids: Joi.string().optional().default(""),
            status: Joi.string(),
            uid: Joi.string(),
            personal_grade: Joi.number(),
            personal_grade_at: Joi.date(),
            partner_grade: Joi.number(),
            partner_grade_at: Joi.date(),
            assesor_grade: Joi.number(),
            assesor_grade_at: Joi.date(),
            overall_grade_raw: Joi.number(),
            overall_grade: Joi.string(),
            grading_id: Joi.number(),
            choosen_grade_id: Joi.number(),
            unit_id: Joi.number(),
            evaluation_id: Joi.number(),
            evaluation_items_id: Joi.number(),
            division_id: Joi.number(),
            due_date: Joi.date(),
            priority: Joi.number(),
            priority_label: Joi.string(),
            grade: Joi.number()
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
    async gradeValidator(req, res, next) {
        const schema = Joi.object({
            grade: Joi.number().integer().required(),
            identifier: Joi.string().required()
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
