const express = require("express");
const EmployeeOutstationController = require("../controllers/EmployeeOutstationController");
const EmployeeOutstationValidator = require("../validator/EmployeeOutstationValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeOutstationController = new EmployeeOutstationController();
const employeeOutstationValidator = new EmployeeOutstationValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeOutstationController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeOutstationController.getOne
)

router.post(
    "/create",
    employeeOutstationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeOutstationController.createOne
)

router.put(
    "/update/:id",
    employeeOutstationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeOutstationController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeOutstationController.delete
)

module.exports = router;
