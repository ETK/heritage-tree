'use strict';
const router = require('express').Router();
const db = require('../../../db/models').sequelize;
const Promise = require('bluebird');
const Relations = db.model('Relations');
const Spouses = db.model('Spouses');

module.exports = router;

// all relations
router.get('/', function(req, res, next) {
  Promise.all([
    Relations.findAll(),
    Spouses.findAll()
  ])
  .spread( function(relations, spouses) {
    res.send({ relations: relations,
               spouses: spouses
             });
  })
  .catch(next);
});
