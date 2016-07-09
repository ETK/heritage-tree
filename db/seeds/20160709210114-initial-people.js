'use strict';

const people = require('./people');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('People', people, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('People', null, {});
  }
};
