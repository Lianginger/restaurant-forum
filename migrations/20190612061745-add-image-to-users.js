'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: '/image/avatar-default.png',
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'image')
  }
};
