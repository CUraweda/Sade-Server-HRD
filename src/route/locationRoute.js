const express = require("express");
const LocationController = require("../controllers/locationController");
const LocationValidator = require("../validator/LocationValidator");

const router = express.Router();
const auth = require("../middlewares/auth");

const locationController = new LocationController();
const locationValidator = new LocationValidator();


router.get(
    "/",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    locationController.getAll
)
router.get(
    "/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    locationController.getOne
)

router.post(
    "/create",
    locationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    locationController.createOne
)

router.put(
    "/update/:id",
    locationValidator.createUpdateValidator,
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    locationController.update
)

router.delete(
    "/delete/:id",
    auth([1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]),
    locationController.delete
)

module.exports = router;
