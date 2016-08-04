'use strict';

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

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
        if(this.nick_name) name += ' "' + this.nick_name + '"';
        if(this.suffix) name += ' ' + this.suffix;
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
        } else if(this.death_year) {
          if(this.death_year) dates += '? - ' + this.death_year;
        } else dates += '--';
        return dates += ')';
      }
    },
    primary_location: {
      type: DataTypes.VIRTUAL,
      get: function() {
        if(this.birth_location) return 'b. ' + this.birth_location;
        if(this.settle_location) return 's. ' + this.settle_location;
        if(this.death_location) return 'd. ' + this.death_location;
        return null;
      }
    },
    identifier: {
      type: DataTypes.VIRTUAL,
      get: function() {
        return this.full_name + ' ' + this.dates;
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
        // person => spouse association
        Person.belongsToMany(models.Person, {
          as: 'Spouses',
          through: 'Spouses',
          foreignKey: 'person_id',
        });
        Person.belongsToMany(models.Person, {
          as: 'Spouses',
          through: 'Spouses',
          foreignKey: 'spouse_id',
        });
      }
    },
    hooks: {
      beforeCreate: function(person) {
        person.first_name = person.first_name.toProperCase();
        if(person.middle_name) person.middle_name = person.middle_name.toProperCase();
        person.last_name = person.last_name.toUpperCase();
        if(person.suffix) {
          if(person.suffix[0].toLowerCase === 'i') person.suffix = person.suffix.toUpperCase(); // I/II/III, etc
          else person.suffix = person.suffix.toProperCase();
        }
      }
    }
  });
  return Person;
};
