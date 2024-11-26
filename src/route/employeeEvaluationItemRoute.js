const express = require("express");
const EmployeeEvaluationItemController = require("../controllers/EmployeeEvaluationItemController");
const EmployeeEvaluationItemValidator = require("../validator/EmployeeEvaluationItemValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeEvaluationItemController = new EmployeeEvaluationItemController();
const employeeEvaluationItemValidator = new EmployeeEvaluationItemValidator();

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationItemController.getAll
);

router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationItemController.getOne
);

router.post(
    "/create",
    employeeEvaluationItemValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationItemController.createOne
);

router.put(
    "/update/:id",
    employeeEvaluationItemValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationItemController.update
);

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeEvaluationItemController.delete
);

module.exports = router;
