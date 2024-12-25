const express = require("express");
const JobdeskUnitController = require("../controllers/JobdeskUnitController");
const JobdeskUnitValidator = require("../validator/JobdeskUnitValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const jobdeskUnitController = new JobdeskUnitController();
const jobdeskUnitValidator = new JobdeskUnitValidator();

router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskUnitController.getAll
);

router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskUnitController.getOne
);

router.post(
    "/create",
    jobdeskUnitValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskUnitController.createOne
);

router.put(
    "/update/:id",
    jobdeskUnitValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskUnitController.update
);

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    jobdeskUnitController.delete
);

module.exports = router;
