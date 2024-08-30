const express = require("express");
const EmployeeBillController = require("../controllers/EmployeeBillController");
const EmployeeBillValidator = require("../validator/EmployeeBillValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeBillController = new EmployeeBillController();
const employeeBillValidator = new EmployeeBillValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeBillController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeBillController.getOne
)

router.post(
    "/add-bill",
    employeeBillValidator.addValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeBillController.addOne
)
router.post(
    "/create",
    employeeBillValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeBillController.createOne
)

router.put(
    "/update/:id",
    employeeBillValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeBillController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeBillController.delete
)

module.exports = router;
