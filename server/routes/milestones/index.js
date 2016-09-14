'use strict';
const router = require('express').Router();
const db = require('../../../db/models').sequelize;
const Milestone = db.model('Milestone');
const People = db.model('Person');
const Auth = require('../../middleware/auth-middleware');

module.exports = router;

const includePeople = [{
  model: People,
  as: 'MilestonePeople'
}];

// TODO: refactor with People routes
function redactDetails(person) {
  if(!person.death_year && (!person.birth_year || person.birth_year > 1916) && person.id != 1329) {
    person.first_name = '[redacted]';
    person.middle_name = null;
    person.nick_name = null;
    person.suffix = null;
    person.birth_month = null;
    person.birth_day = null;
    person.notes = null;
  }
  // Redact personal information from me
  else if(person.id == 1329) {
    person.middle_name = null;
    person.nick_name = null;
    person.suffix = null;
    person.birth_month = null;
    person.birth_day = null;
    person.birth_location = null;
    person.notes = null;
  }
  return person;
}

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
  .then(milestones => {
    if(Auth.isAuthenticated(req)) res.send(milestones);
    else {
      milestones.forEach(function(milestone) {
        milestone.MilestonePeople.map(redactDetails);
      });
      res.send(milestones);
    }
  })
  .catch(next);
});

// create a milestone
router.post('/', Auth.assertAdmin, function(req, res, next) {
  Milestone.create(req.body)
  .then(milestone => res.send(milestone))
  .catch(next);
});

// update a milestone
router.put('/:milestoneId', Auth.assertAdmin, function(req, res, next) {
  req.milestone.update(req.body)
  .then(updatedMilestone => res.status(200).send(updatedMilestone))
  .catch(next);
});

// delete a milestone
router.delete('/:milestoneId', Auth.assertAdmin, function(req, res, next) {
  req.milestone.destroy()
  .then(() => res.status(204).end())
  .catch(next);
});

// associate a person to a milestone
router.post('/:milestoneId/person', Auth.assertAdmin, function(req, res, next) {
  req.milestone.addMilestonePerson(req.body.id)
  .then( function() {
    return Milestone.findById(req.params.milestoneId, { include: includePeople });
  })
  .then(updatedMilestone => res.send(updatedMilestone))
  .catch(next);
});

// delete milestone/person relationship
router.delete('/:milestoneId/person/:personId', Auth.assertAdmin, function(req, res, next) {
  req.milestone.removeMilestonePerson(req.params.personId)
  .then( function() {
    return Milestone.findById(req.params.milestoneId, { include: includePeople });
  })
  .then(() => res.status(204).end())
  .catch(next);
});

// all milestones for an associated person
router.get('/person/:personId', function(req, res, next) {
  Milestone.findAll({
    include: [{
      model: People,
      as: 'MilestonePeople',
      where: { id: req.params.personId }
    }]
  })
  .then(milestones => {
    if(Auth.isAuthenticated(req)) res.send(milestones);
    else {
      milestones.forEach(function(milestone) {
        milestone.MilestonePeople.map(redactDetails);
      });
      res.send(milestones);
    }
  })
  .catch(next);
});
