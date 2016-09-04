'use strict';
const router = require('express').Router();
const db = require('../../../db/models').sequelize;
const User = db.model('User');

module.exports = router;

// Create a user
router.post('/', function(req, res, next) {
  console.log(req.body)
  if(!req.body.user_name || !req.body.password) {
    res.status(400).send('Missing required new user data.');
  } else {
    User.findOrCreate({
      where: {
        user_name: req.body.user_name,
      },
      defaults: { password: req.body.password }
    })
    .spread(function(user, created) {
      if(!created) res.status(400).send('User already exists.');
      else res.json(user);
    })
    .catch(next);
  }
});
