const express = require("express");
const EmployeeVacationController = require("../controllers/EmployeeVacationController");
const EmployeeVacationValidator = require("../validator/EmployeeVacationValidator");

const router = express.Router();
const auth = require("../middlewares/auth");
const Upload = require("../middlewares/upload");

const employeeVacationController = new EmployeeVacationController();
const employeeVacationValidator = new EmployeeVacationValidator();
const uplodMiddleware = new Upload('/vacation', [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
])


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
    uplodMiddleware.uploadFileSingle("file"),
    employeeVacationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeVacationController.createOne
)
router.post(
    "/request",
    uplodMiddleware.uploadFileSingle("file"),
    employeeVacationValidator.requestVacationValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeVacationController.createRequest
)


router.put(
    "/change-status/:condition/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeVacationController.changeStatus
)
router.put(
    "/change/:id",
    uplodMiddleware.uploadFileSingle("file"),
    employeeVacationValidator.changeVacationValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeVacationController.changeData
)
router.put(
    "/update/:id",
    uplodMiddleware.uploadFileSingle("file"),
    employeeVacationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeVacationController.update
)

router.delete(
    "/remove/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeVacationController.removeData
)
router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeVacationController.delete
)

module.exports = router;
