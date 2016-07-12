'use strict';
const router = require('express').Router();
const db = require('../../../db/models').sequelize;
const People = db.model('Person');
const Relations = db.model('Relations');
const Spouses = db.model('Spouses');

module.exports = router;

const includeRelations = { include: [{
  model: People,
  as: 'Parents'
}, {
  model: People,
  as: 'Children'
}, {
  model: People,
  as: 'Spouses'
}] };

router.param('personId', function(req, res, next, id) {
  People.findById(id)
  .then(function(person) {
    if (!person) res.status(404).end();
    req.person = person;
    next();
  }).catch(next);
});

router.param('spouseId', function(req, res, next, id) {
  People.findById(id)
  .then(function(person) {
    if (!person) res.status(404).end();
    req.spouse = person;
    next();
  }).catch(next);
});

// all people
router.get('/', function(req, res, next) {
  People.findAll(includeRelations)
  .then(people => res.send(people))
  .catch(next);
});

// one person
router.get('/:personId', function(req, res, next) {
  People.findById(req.params.personId, includeRelations)
  .then(person => res.send(person))
  .catch(next);
});

// update a person
router.put('/:personId', function(req, res, next) {
  req.person.update(req.body)
  .then(updatedPerson => res.status(200).send(updatedPerson));
});

// add parent
router.post('/:personId/parents', function(req, res, next) {
  req.person.addParent(req.body.id)
  .then( function() {
    return People.findById(req.person.id, includeRelations);
  })
  .then(person => res.send(person))
  .catch(next);
});

// add child
router.post('/:personId/children', function(req, res, next) {
  req.person.addChild(req.body.id)
  .then( function() {
    return People.findById(req.person.id, includeRelations);
  })
  .then(person => res.send(person))
  .catch(next);
});

// add spouse
router.post('/:personId/spouses', function(req, res, next) {
  Promise.all([
    req.person.addSpouse(req.body.id), // add spouse (B) to selected person (A)
    People.findById(req.body.id) // add selected person (A) as a spouse to person (B)
    .then( function(personB) {
      return personB.addSpouse(req.person.id);
    })
  ])
  .then( function() {
    return People.findById(req.person.id, includeRelations);
  })
  .then(person => res.send(person))
  .catch(next);
});

// update spousal relationship
router.put('/:personId/spouses/:spouseId', function(req, res,next) {
  Spouses.update(req.body, { where: {
    $or: [
      { person_id: req.person.id,
        spouse_id: req.spouse.id
      },
      { person_id: req.spouse.id,
        spouse_id: req.person.id
      }
    ]
  } })
  .spread(function(numUpdatedRows, updatedRelationships) {
    console.log(updatedRelationships);
    res.status(200).send(updatedRelationships);
  })
  .catch(next);
})

// delete parent/child relationship
router.delete('/:personId/relationships/:relativeId', function(req, res, next) {
  Promise.all([
    req.person.removeParent(req.params.relativeId),
    req.person.removeChild(req.params.relativeId)
  ])
  .then(() => res.status(204).end())
  .catch(next);
});

// delete spousal relationship
router.delete('/:personId/spouses/:spouseId', function(req, res, next) {
  Promise.all([
    req.person.removeSpouse(req.spouse.id),
    req.spouse.removeSpouse(req.person.id)
  ])
  .then(() => res.status(204).end())
  .catch(next);
});
