'use strict';
const router = require('express').Router();
const db = require('../../../db/models').sequelize;
const Milestone = db.model('Milestone');
const People = db.model('Person');

module.exports = router;

router.param('milestoneId', function(req, res, next, id) {
  Milestone.findById(id, { include: [People] })
  .then(function(person) {
    if (!person) res.status(404).end();
    req.milestone = milestone;
    next();
  }).catch(next);
});

// all milestones
router.get('/', function(req, res, next) {
  console.log('in route')
  Milestone.findAll({})
  .then(milestones => res.send(milestones))
  .catch(next);
});

// create a milestone
router.post('/', function(req, res, next) {
  Milestone.create(req.body)
  .then(milestone => res.send(milestone))
  .catch(next);
});

// one milestone
router.get('/:milestoneId', function(req, res, next) {
  res.send(req.milestone);
});
