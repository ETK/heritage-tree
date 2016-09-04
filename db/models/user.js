'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
      instanceMethods: {
          sanitize: function () {
              return _.omit(this.toJSON(), ['password', 'salt']);
          },
          correctPassword: function (candidatePassword) {
              return this.Model.encryptPassword(candidatePassword, this.salt) === this.password;
          }
      },
      classMethods: {
          generateSalt: function () {
              return crypto.randomBytes(16).toString('base64');
          },
          encryptPassword: function (plainText, salt) {
              var hash = crypto.createHash('sha1');
              hash.update(plainText);
              hash.update(salt);
              return hash.digest('hex');
          }
      },
      hooks: {
  		beforeCreate: function (user) {
  			if (user.changed('password')) {
  				user.salt = user.Model.generateSalt();
  				user.password = user.Model.encryptPassword(user.password, user.salt);
  			}
  		},
  		beforeUpdate: function(user) {
  			if (user.changed('password')) {
  				user.salt = user.Model.generateSalt();
  				user.password = user.Model.encryptPassword(user.password, user.salt);
  			}
  		}
  	}
  });

  return User;
};
