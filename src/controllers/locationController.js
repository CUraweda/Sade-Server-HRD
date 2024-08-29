const locationService = require("../service/locationService");

module.exports = {
  getAllLocations: async (req, res) => {
    try {
      const locations = await locationService.getAllLocations();
      res.status(200).json(locations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createLocation: async (req, res) => {
    try {
      const { lat, lng, radius, nama } = req.body;
      const newLocation = await locationService.createLocation({
        lat,
        lng,
        radius,
        nama,
      });
      res.status(201).json(newLocation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateLocation: async (req, res) => {
    try {
      const { id, lat, lng, radius, nama } = req.body;
      const updatedLocation = await locationService.updateLocation({
        id,
        lat,
        lng,
        radius,
        nama,
      });
      res.status(200).json(updatedLocation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteLocation: async (req, res) => {
    try {
      const { id } = req.body;
      await locationService.deleteLocation(id);
      res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
