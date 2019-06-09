'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Restaurants', 'image', {
      type: Sequelize.STRING,
      defaultValue: '/upload/default-image.jpg',
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Restaurants', 'image')
  }
};
