'use strict';
const router = require('express').Router();
const db = require('../../../db/models').sequelize;
const People = db.model('Person');

module.exports = router;

router.param('personId', function(req, res, next, id) {
  People.findById(id)
  .then(function(person) {
    if (!person) res.status(404).end();
    req.person = person;
    next();
  }).catch(next);
});

// all people
router.get('/', function(req, res, next) {
  People.findAll({})
  .then(people => res.send(people))
  .catch(next);
});

// update a person
router.put('/:personId', function(req, res, next) {
  req.person.update(req.body)
  .then(updatedPerson => res.status(200).send(updatedPerson));
});
