const express = require("express");
const EmployeeEvaluationController = require("../controllers/EmployeeEvaluationController");
const EmployeeEvaluationValidator = require("../validator/EmployeeEvaluationValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeEvaluationController = new EmployeeEvaluationController();
const employeeEvaluationValidator = new EmployeeEvaluationValidator();

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationController.getAll
);

router.get(
    "/detail/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationController.getDetail
);

router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationController.getOne
);

router.post(
    "/generate-month",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationController.createByMonth
)
router.post(
    "/calculate-preview/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationController.calculatePreview
)
router.post(
    "/calculate/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationController.calculateEvaluation
)

router.post(
    "/create",
    employeeEvaluationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationController.createOne
);

router.put(
    "/update/:id",
    employeeEvaluationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationController.update
);

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationController.delete
);

module.exports = router;
