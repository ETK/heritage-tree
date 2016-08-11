'use strict';
module.exports = function(sequelize, DataTypes) {
  var Milestone = sequelize.define('Milestone', {
    title: DataTypes.STRING,
    year: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    type: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Milestone.belongsToMany(models.Person, {
          as: 'MilestonePeople',
          through: 'MilestonesPeople',
          foreignKey: 'milestone_id'
        });
      }
    }
  });
  return Milestone;
};
