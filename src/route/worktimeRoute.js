const express = require("express");
const WorktimeController = require("../controllers/WorktimeController");
const WorktimeValidator = require("../validator/WorktimeValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const worktimeController = new WorktimeController();
const worktimeValidator = new WorktimeValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    worktimeController.getAll
)
router.get(
    "/today",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    worktimeController.getToday
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    worktimeController.getOne
)

router.post(
    "/create",
    worktimeValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    worktimeController.createOne
)
router.post(
    "/create-upsert",
    worktimeValidator.upsertValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    worktimeController.upsertOne
)

router.put(
    "/update/:id",
    worktimeValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    worktimeController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    worktimeController.delete
)

module.exports = router;
