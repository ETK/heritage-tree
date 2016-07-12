'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Spouses', {
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
      spouse_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      married_year: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1400,
          max: 2100
        }
      },
      divorced: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      divorced_year: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1400,
          max: 2100
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Spouses');
  }
};
