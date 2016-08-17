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


// all relations - temporary, limited data set`
router.get('/smallSet', function(req, res, next) {
  var peopleList = [1329, 1330, 1331, 1328, 1027, 1444, 1447, 1332, 1333, 1334, 1610, 664, 1327];
  Promise.all([
    Relations.findAll({
      where: { $and: [{
          parent_id: { $in: peopleList }
        }, {
          person_id: { $in: peopleList }
        }]
      }
    }),
    Spouses.findAll()
  ])
  .spread( function(relations, spouses) {
    res.send({ relations: relations,
               spouses: spouses
             });
  })
  .catch(next);
});
