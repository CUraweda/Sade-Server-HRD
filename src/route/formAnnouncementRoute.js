const express = require("express");
const FormAnnouncementController = require("../controllers/FormAnnouncementController");
const FormAnnouncementValidator = require("../validator/FormAnnouncementValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const formAnnouncementController = new FormAnnouncementController();
const formAnnouncementValidator = new FormAnnouncementValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    formAnnouncementController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    formAnnouncementController.getOne
)

router.post(
    "/create",
    formAnnouncementValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    formAnnouncementController.createOne
)

router.put(
    "/update/:id",
    formAnnouncementValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    formAnnouncementController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    formAnnouncementController.delete
)

module.exports = router;
