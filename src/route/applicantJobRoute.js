const express = require("express");
const ApplicantJobController = require("../controllers/ApplicantJobController");
const ApplicantJobValidator = require("../validator/ApplicantJobValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const applicantJobController = new ApplicantJobController();
const applicantJobValidator = new ApplicantJobValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantJobController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantJobController.getOne
)

router.post(
    "/create",
    applicantJobValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantJobController.createOne
)

router.put(
    "/update/:id",
    applicantJobValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantJobController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    applicantJobController.delete
)

module.exports = router;
