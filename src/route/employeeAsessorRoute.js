const express = require("express");
const EmployeeAsessorController = require("../controllers/EmployeeAsessorController");
const EmployeeAsessorValidator = require("../validator/EmployeeAsessorValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeAsessorController = new EmployeeAsessorController();
const employeeAsessorValidator = new EmployeeAsessorValidator()

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAsessorController.getAll
)

router.put(
    "/activate/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAsessorController.updateActivate
)
router.put(
    "/deactivate/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeeAsessorController.updateDeactivate
)

module.exports = router;
