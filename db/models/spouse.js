'use strict';
module.exports = function(sequelize, DataTypes) {
  var Spouses = sequelize.define('Spouses', {
    person_id: DataTypes.INTEGER,
    spouse_id: DataTypes.INTEGER,
    married_year: DataTypes.INTEGER,
    divorced: DataTypes.BOOLEAN,
    divorced_year: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Spouses;
};
