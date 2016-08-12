'use strict';
const router = require('express').Router();
const db = require('../../../db/models').sequelize;
const Milestone = db.model('Milestone');
const People = db.model('Person');

module.exports = router;

const includePeople = [{
  model: People,
  as: 'MilestonePeople'
}]

router.param('milestoneId', function(req, res, next, id) {
  Milestone.findById(id, { include: includePeople })
  .then(function(milestone) {
    if (!milestone) res.status(404).end();
    req.milestone = milestone;
    next();
  }).catch(next);
});

// all milestones
router.get('/', function(req, res, next) {
  Milestone.findAll({ include: includePeople })
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

// associate a person to a milestone
router.post('/:milestoneId/person', function(req, res, next) {
  req.milestone.addMilestonePerson(req.body.id)
  .then( function() {
    return Milestone.findById(req.params.milestoneId, { include: includePeople });
  })
  .then(updatedMilestone => res.send(updatedMilestone))
  .catch(next);
});