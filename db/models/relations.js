'use strict';
module.exports = function(sequelize, DataTypes) {
  var Relations = sequelize.define('Relations', {
    person_id: DataTypes.INTEGER,
    parent_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Relations;
};
