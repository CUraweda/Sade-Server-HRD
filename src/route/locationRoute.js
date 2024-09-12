const express = require("express");
const LocationController = require("../controllers/LocationController");
const LocationValidator = require("../validator/LocationValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const locationController = new LocationController();
const locationValidator = new LocationValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    locationController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    locationController.getOne
)

router.post(
    "/create",
    locationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    locationController.createOne
)

router.put(
    "/update/:id",
    locationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    locationController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    locationController.delete
)

module.exports = router;
