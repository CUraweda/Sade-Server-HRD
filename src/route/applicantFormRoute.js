const express = require("express");
const ApplicantFormController = require("../controllers/ApplicantFormController");
const ApplicantFormValidator = require("../validator/ApplicantFormValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const applicantFormController = new ApplicantFormController();
const applicantFormValidator = new ApplicantFormValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantFormController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantFormController.getOne
)

router.post(
    "/create",
    applicantFormValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantFormController.createOne
)

router.post(
    "/send",
    applicantFormValidator.sendFormValidator,
)

router.put(
    "/update/:id",
    applicantFormValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantFormController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    applicantFormController.delete
)

module.exports = router;
