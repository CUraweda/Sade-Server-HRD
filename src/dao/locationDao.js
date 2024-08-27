const { Location } = require("../models");

module.exports = {
  getAllLocations: async () => {
    return await Location.findAll();
  },

  createLocation: async (locationData) => {
    return await Location.create(locationData);
  },

  updateLocation: async (locationData) => {
    const { id, lat, lng, radius, nama } = locationData;
    const location = await Location.findByPk(id);
    if (location) {
      location.lat = lat;
      location.lng = lng;
      location.radius = radius;
      location.nama = nama;
      return await location.save();
    }
    throw new Error("Location not found");
  },

  deleteLocation: async (id) => {
    const location = await Location.findByPk(id);
    if (location) {
      await location.destroy();
    } else {
      throw new Error("Location not found");
    }
  },
};
