'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Milestones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 800,
          max: 2100
        }
      },
      description: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.STRING
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
    // create relation table
    .then( function() {
      return queryInterface.createTable('MilestonesPeople', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        milestone_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        person_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
      });
    })
    // add indices
    .then( function() {
      return queryInterface.addIndex(
        'MilestonesPeople',
        ['milestone_id', 'person_id'],
        {
          indexName: 'MilestoneIndex'
        }
      );
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Milestones')
    .then( function() {
      return queryInterface.dropTable('MilestonesPeople');
    });
  }
};
