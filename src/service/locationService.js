const locationDao = require("../dao/locationDao");

module.exports = {
  getAllLocations: () => {
    return locationDao.getAllLocations();
  },

  createLocation: (locationData) => {
    return locationDao.createLocation(locationData);
  },

  updateLocation: (locationData) => {
    return locationDao.updateLocation(locationData);
  },

  deleteLocation: (id) => {
    return locationDao.deleteLocation(id);
  },
};
