const express = require("express");
const JobdeskGradeController = require("../controllers/JobdeskGradeController");
const JobdeskGradeValidator = require("../validator/JobdeskGradeValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const jobdeskGradeController = new JobdeskGradeController();
const jobdeskGradeValidator = new JobdeskGradeValidator();

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskGradeController.getAll
);

router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskGradeController.getOne
);

router.post(
    "/create",
    jobdeskGradeValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskGradeController.createOne
);
router.post(
    "/add",
    jobdeskGradeValidator.addValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskGradeController.addOne
);

router.put(
    "/update/:id",
    jobdeskGradeValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskGradeController.update
);

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskGradeController.delete
);

module.exports = router

