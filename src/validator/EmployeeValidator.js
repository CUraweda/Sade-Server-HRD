const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

class EmployeeValidator {
  async employeeCreateUpdateValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      user_id: Joi.number().integer(),
      employee_no: Joi.string(),
      full_name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      nik: Joi.string(),
      religion: Joi.string(),
      gender: Joi.string(),
      pob: Joi.string(),
      dob: Joi.date(),
      marital_status: Joi.string(),
      last_education: Joi.string(),
      major: Joi.string(),
      certificate_year: Joi.string(),
      is_education: Joi.string(),
      employee_status: Joi.string(),
      work_start_date: Joi.string(),
      occupation: Joi.string(),
      is_teacher: Joi.string(),
      duty: Joi.string(),
      job_desc: Joi.string().allow("", null),
      grade: Joi.string(),
      still_in_probation: Joi.boolean(),
      probation_start_date: Joi.date(),
      probation_end_date: Joi.date(),
      division_id: Joi.number().integer(),
      is_outstation: Joi.boolean(),
      is_assessor: Joi.boolean()
    });

    // schema options
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);

    if (error) {
      // on fail return comma separated errors
      const errorMessage = error.details
        .map((details) => {
          return details.message;
        })
        .join(", ");
      next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    } else {
      // on success replace req.body with validated value and trigger next middleware function
      req.body = value;
      return next();
    }
  }
  async attachEmployeeValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      user_id: Joi.number()
    });

    // schema options
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: false, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);

    if (error) {
      // on fail return comma separated errors
      const errorMessage = error.details
        .map((details) => {
          return details.message;
        })
        .join(", ");
      next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    } else {
      // on success replace req.body with validated value and trigger next middleware function
      req.body = value;
      return next();
    }
  }
  async outstationEmployeeValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      is_outstation: Joi.boolean().required()
    });

    // schema options
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: false, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);

    if (error) {
      // on fail return comma separated errors
      const errorMessage = error.details
        .map((details) => {
          return details.message;
        })
        .join(", ");
      next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    } else {
      // on success replace req.body with validated value and trigger next middleware function
      req.body = value;
      return next();
    }
  }
  async divisionEmployeeValidator(req, res, next) {
    // create schema object
    const schema = Joi.object({
      division_id: Joi.number().integer().required()
    });

    // schema options
    const options = {
      abortEarly: false, // include all errors
      allowUnknown: false, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);

    if (error) {
      // on fail return comma separated errors
      const errorMessage = error.details
        .map((details) => {
          return details.message;
        })
        .join(", ");
      next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    } else {
      // on success replace req.body with validated value and trigger next middleware function
      req.body = value;
      return next();
    }
  }
}

module.exports = EmployeeValidator;
