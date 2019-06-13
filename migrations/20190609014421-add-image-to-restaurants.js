'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Restaurants', 'image', {
      type: Sequelize.STRING,
      defaultValue: '/image/restaurant-default.jpg',
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Restaurants', 'image')
  }
};
