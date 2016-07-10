'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'People',
      'settle_location',
      Sequelize.STRING
    )
    .then(function() {
      return queryInterface.addColumn(
        'People',
        'death_location',
        Sequelize.STRING
      );
    })
    .then(function() {
      return queryInterface.renameColumn(
        'People',
        'birth_place',
        'birth_location'
      );
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('People', 'settle_location')
    .then(function() {
      return queryInterface.removeColumn('People', 'death_location');
    });
  }
};
