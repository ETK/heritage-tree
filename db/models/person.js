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
    notes: DataTypes.TEXT,
    full_name: {
      type: DataTypes.VIRTUAL,
      get: function() {
        var name = this.last_name + ', ' + this.first_name;
        if(this.middle_name) name += ' ' + this.middle_name;
        return name;
      }
    },
    dates: {
      type: DataTypes.VIRTUAL,
      get: function() {
        var dates = '(';
        if(this.birth_year) {
          dates += this.birth_year;
          if(this.death_year) dates += ' - ' + this.death_year;
        } else dates += '--';
        return dates += ')';
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // person => parents association
        Person.belongsToMany(models.Person, {
          as: 'Parents',
          through: 'Relations',
          foreignKey: 'person_id'
        });
        // person => children association
        Person.belongsToMany(models.Person, {
          as: 'Children',
          through: 'Relations',
          foreignKey: 'parent_id'
        });
      }
    }
  });
  return Person;
};
