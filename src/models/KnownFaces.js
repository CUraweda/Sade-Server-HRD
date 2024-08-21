'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const KnownFaces = sequelize.define('KnownFaces', {
    name: DataTypes.STRING,
    descriptor: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  }, {
    tableName: 'tbl_known_faces',
    timestamps: true
  });

  return KnownFaces;
};
