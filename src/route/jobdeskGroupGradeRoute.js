const express = require("express");
const JobdeskGroupGradeController = require("../controllers/JobdeskGroupGradeController");
const JobdeskGroupGradeValidator = require("../validator/JobdeskGroupGradeValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const jobdeskGroupGradeController = new JobdeskGroupGradeController();
const jobdeskGroupGradeValidator = new JobdeskGroupGradeValidator();

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskGroupGradeController.getAll
);

router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskGroupGradeController.getOne
);

router.post(
    "/create",
    jobdeskGroupGradeValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskGroupGradeController.createOne
);

router.put(
    "/update/:id",
    jobdeskGroupGradeValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskGroupGradeController.update
);

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskGroupGradeController.delete
);

module.exports = router;
