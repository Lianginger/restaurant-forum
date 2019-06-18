'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    followerId: DataTypes.INTEGER,
    followindId: DataTypes.INTEGER
  }, {});
  Followship.associate = function(models) {
    // associations can be defined here
  };
  return Followship;
};