const express = require("express");
const EmployeeVacationController = require("../controllers/EmployeeVacationController");
const EmployeeVacationValidator = require("../validator/EmployeeVacationValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeVacationController = new EmployeeVacationController();
const employeeVacationValidator = new EmployeeVacationValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeVacationController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeVacationController.getOne
)

router.post(
    "/create",
    employeeVacationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeVacationController.createOne
)

router.put(
    "/update/:id",
    employeeVacationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeVacationController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeVacationController.delete
)

module.exports = router;
