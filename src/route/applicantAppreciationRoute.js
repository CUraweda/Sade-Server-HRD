const express = require("express");
const ApplicantAppreciationController = require("../controllers/ApplicantAppreciationController");
const ApplicantAppreciationValidator = require("../validator/ApplicantAppreciationValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const applicantAppreciationController = new ApplicantAppreciationController();
const applicantAppreciationValidator = new ApplicantAppreciationValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAppreciationController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAppreciationController.getOne
)

router.post(
    "/create",
    applicantAppreciationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAppreciationController.createOne
)

router.put(
    "/update/:id",
    applicantAppreciationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAppreciationController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantAppreciationController.delete
)

module.exports = router;
