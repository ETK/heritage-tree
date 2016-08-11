'use strict';
module.exports = function(sequelize, DataTypes) {
  var Milestone = sequelize.define('Milestone', {
    title: DataTypes.STRING,
    year: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Milestone.belongsToMany(models.Person, {
          as: 'Milestones',
          through: 'MilestonesPeople',
          foreignKey: 'person_id'
        });
      }
    }
  });
  return Milestone;
};
