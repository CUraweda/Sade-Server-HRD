const express = require("express");
const WorktimeController = require("../controllers/WorktimeController");
const WorktimeValidator = require("../validator/WorktimeValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const worktimeController = new WorktimeController();
const worktimeValidator = new WorktimeValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    worktimeController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    worktimeController.getOne
)

router.post(
    "/create",
    worktimeValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    worktimeController.createOne
)

router.put(
    "/update/:id",
    worktimeValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    worktimeController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    worktimeController.delete
)

module.exports = router;
