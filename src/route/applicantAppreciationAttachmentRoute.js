const express = require("express");
const ApplicantAppreciationAttachmentController = require("../controllers/ApplicantAppreciationAttachmentController");
const ApplicantAppreciationAttachmentValidator = require("../validator/ApplicantAppreciationAttachmentValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const applicantAppreciationAttachmentController = new ApplicantAppreciationAttachmentController();
const applicantAppreciationAttachmentValidator = new ApplicantAppreciationAttachmentValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAppreciationAttachmentController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAppreciationAttachmentController.getOne
)

router.post(
    "/create",
    applicantAppreciationAttachmentValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAppreciationAttachmentController.createOne
)

router.put(
    "/update/:id",
    applicantAppreciationAttachmentValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAppreciationAttachmentController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAppreciationAttachmentController.delete
)

module.exports = router;
