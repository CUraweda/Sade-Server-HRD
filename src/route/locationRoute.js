const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

router.get("/", locationController.getAllLocations);

router.post("/create", locationController.createLocation);

router.put("/update", locationController.updateLocation);

router.delete("/delete", locationController.deleteLocation);

router.get("/test", (req, res) => {
  res.send({ message: "Hello" });
});

module.exports = router;
