'use strict';
const router = require('express').Router();
const db = require('../../../db/models').sequelize;
const People = db.model('Person');

module.exports = router;

router.get('/', function(req, res, next) {
  People.findAll({})
  .then(people => res.send(people))
  .catch(next);
});
