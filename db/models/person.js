'use strict';
module.exports = function(sequelize, DataTypes) {
  var Person = sequelize.define('Person', {
    last_name: DataTypes.STRING,
    first_name: DataTypes.STRING,
    middle_name: DataTypes.STRING,
    nick_name: DataTypes.STRING,
    suffix: DataTypes.STRING,
    relation_to_grandpa: DataTypes.STRING,
    gender: DataTypes.STRING,
    birth_location: DataTypes.STRING,
    birth_year: DataTypes.INTEGER,
    birth_month: DataTypes.INTEGER,
    birth_day: DataTypes.INTEGER,
    settle_location: DataTypes.STRING,
    death_location: DataTypes.STRING,
    death_year: DataTypes.INTEGER,
    death_month: DataTypes.INTEGER,
    death_day: DataTypes.INTEGER,
    notes: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Person;
};
