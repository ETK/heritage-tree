'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('People', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      first_name: {
        type: Sequelize.STRING
      },
      middle_name: {
        type: Sequelize.STRING
      },
      nick_name: {
        type: Sequelize.STRING
      },
      suffix: {
        type: Sequelize.STRING
      },
      relation_to_grandpa: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isIn: [['M','F']]
        }
      },
      birth_place: {
        type: Sequelize.STRING
      },
      birth_year: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1400,
          max: 2100
        }
      },
      birth_month: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 12
        }
      },
      birth_day: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 31
        }
      },
      death_year: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1400,
          max: 2100
        }
      },
      death_month: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 12
        }
      },
      death_day: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 31
        }
      },
      notes: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('People');
  }
};
