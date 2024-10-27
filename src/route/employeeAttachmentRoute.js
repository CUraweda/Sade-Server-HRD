const express = require("express");
const EmployeeAttachmentController = require("../controllers/EmployeeAttachmentController");
const EmployeeAttachmentValidator = require("../validator/EmployeeAttachmentValidator");
const UploadMiddleware = require("../middlewares/upload");

const router = express.Router();
const auth = require("../middlewares/auth");

const employeeAttachmentController = new EmployeeAttachmentController();
const employeeAttachmentValidator = new EmployeeAttachmentValidator();
const uploadMiddleware = new UploadMiddleware('file_attachment ', [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
])

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeAttachmentController.getAll
)
router.get(
    "/by-employee/:id",
auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeAttachmentController.getByEmployee
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeAttachmentController.getOne
)

router.post(
    "/create",
    uploadMiddleware.uploadFileSingle("file"),
    employeeAttachmentValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeAttachmentController.createOne
)

router.put(
    "/add-attachment/:id",
    employeeAttachmentValidator.addAttachmentValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeAttachmentController.addAttachment
)

router.put(
    "/update/:id",
    uploadMiddleware.uploadFileSingle("file"),
    employeeAttachmentValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeAttachmentController.update
)

router.delete(
    "/delete-attachment/:id",
    employeeAttachmentValidator.deleteAttachmentValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeAttachmentController.deleteAttachment
)
router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    employeeAttachmentController.delete
)

module.exports = router;
