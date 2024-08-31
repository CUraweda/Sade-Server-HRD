const express = require("express");
const EmployeeAttachmentController = require("../controllers/EmployeeAttachmentController");
const EmployeeAttachmentValidator = require("../validator/EmployeeAttachmentValidator");
const UploadMiddleware = require("../middlewares/upload");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeAttachmentController = new EmployeeAttachmentController();
const employeeAttachmentValidator = new EmployeeAttachmentValidator();
const uploadMiddleware = new UploadMiddleware('e_attachment ', [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
])

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAttachmentController.getAll
)
router.get(
    "/by-employee/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAttachmentController.getByEmployee
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAttachmentController.getOne
)

router.post(
    "/create",
    uploadMiddleware.uploadFileSingle("file"),
    employeeAttachmentValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAttachmentController.createOne
)

router.put(
    "/update/:id",
    uploadMiddleware.uploadFileSingle("file"),
    employeeAttachmentValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAttachmentController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    employeeAttachmentController.delete
)

module.exports = router;
