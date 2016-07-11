'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Relations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      person_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then(function() {
      return queryInterface.addIndex(
        'Relations',
        ['person_id', 'parent_id'],
        {
          indexName: 'ParentIndex',
          indicesType: 'UNIQUE'
        }
      );
    })
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Relations');
  }
};
