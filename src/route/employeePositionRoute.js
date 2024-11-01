const express = require("express");
const EmployeePositionController = require("../controllers/EmployeePositionController");
const EmployeePositionValidator = require("../validator/EmployeePositionValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeePositionController = new EmployeePositionController();
const employeePositionValidator = new EmployeePositionValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeePositionController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeePositionController.getOne
)

router.post(
    "/create",
    employeePositionValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeePositionController.createOne
)

router.put(
    "/update/:id",
    employeePositionValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeePositionController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    employeePositionController.delete
)

module.exports = router;
