'use strict';
const router = require('express').Router();
const db = require('../../../db/models').sequelize;
const People = db.model('Person');
const Spouses = db.model('Spouses');
const Auth = require('../../middleware/auth-middleware');

module.exports = router;

const allRelations = [{
  model: People,
  as: 'Parents'
}, {
  model: People,
  as: 'Children'
}, {
  model: People,
  as: 'Spouses'
}];

// TODO: refactor with Milestone routes
function makeRedactions(person) {
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

function redactDetails(person) {
  if(person.Parents && person.Parents.length) person.Parents = person.Parents.map(makeRedactions); // redact parents
  if(person.Children && person.Children.length) person.Children = person.Children.map(makeRedactions); // redact children
  if(person.Spouses && person.Spouses.length) person.Spouses = person.Spouses.map(makeRedactions); // redact spouses
  return makeRedactions(person); // redact self
}

router.use('/relations', require('./relations'));

router.param('personId', function(req, res, next, id) {
  People.findById(id)
  .then(function(person) {
    if (!person) res.status(404).end();
    if(Auth.isAuthenticated(req)) req.person = person;
    else req.person = redactDetails(person);
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
  var options = { include: allRelations,
                  order: [['birth_year', 'ASC']] };
  if(req.query && req.query.includeRelations && req.query.includeRelations === 'false') {
    options.include = null;
  }
  People.findAll(options)
  .then(people => {
    if(Auth.isAuthenticated(req)) res.send(people);
    else res.send(people.map(redactDetails));
  })
  .catch(next);
});

// create a person
router.post('/', Auth.assertAdmin, function(req, res, next) {
  People.create(req.body)
  .then(person => res.send(person))
  .catch(next);
});

// one person
router.get('/:personId', function(req, res, next) {
  People.findById(req.params.personId, { include: allRelations })
  .then(person => {
    if(Auth.isAuthenticated(req)) res.send(person);
    else res.send(redactDetails(person));
  })
  .catch(next);
});

// update a person
router.put('/:personId', Auth.assertAdmin, function(req, res, next) {
  req.person.update(req.body)
  .then(updatedPerson => res.status(200).send(updatedPerson))
  .catch(next);
});

// add parent
router.post('/:personId/parents', Auth.assertAdmin, function(req, res, next) {
  req.person.addParent(req.body.id)
  .then( function() {
    return People.findById(req.person.id, { include: allRelations });
  })
  .then(person => res.send(person))
  .catch(next);
});

// add child
router.post('/:personId/children', Auth.assertAdmin, function(req, res, next) {
  req.person.addChild(req.body.id)
  .then( function() {
    return People.findById(req.person.id, { include: allRelations });
  })
  .then(person => res.send(person))
  .catch(next);
});

// add spouse
router.post('/:personId/spouses', Auth.assertAdmin, function(req, res, next) {
  Promise.all([
    req.person.addSpouse(req.body.id), // add spouse (B) to selected person (A)
    People.findById(req.body.id) // add selected person (A) as a spouse to person (B)
    .then( function(personB) {
      return personB.addSpouse(req.person.id);
    })
  ])
  .then( function() {
    return People.findById(req.person.id, { include: allRelations });
  })
  .then(person => res.send(person))
  .catch(next);
});

// update spousal relationship
router.put('/:personId/spouses/:spouseId', Auth.assertAdmin, function(req, res,next) {
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
    res.status(200).send(updatedRelationships);
  })
  .catch(next);
})

// delete parent/child relationship
router.delete('/:personId/relationships/:relativeId', Auth.assertAdmin, function(req, res, next) {
  Promise.all([
    req.person.removeParent(req.params.relativeId),
    req.person.removeChild(req.params.relativeId)
  ])
  .then(() => res.status(204).end())
  .catch(next);
});

// delete spousal relationship
router.delete('/:personId/spouses/:spouseId', Auth.assertAdmin, function(req, res, next) {
  Promise.all([
    req.person.removeSpouse(req.spouse.id),
    req.spouse.removeSpouse(req.person.id)
  ])
  .then(() => res.status(204).end())
  .catch(next);
});
