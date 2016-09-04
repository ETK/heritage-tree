'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function (app, db) {

  const User = db.model('User');

  // When passport.authenticate('local') is used, this function will receive
  // the email and password to run the actual authentication logic.
  const strategyFn = function (email, password, done) {
    User.findOne({ where: { email: email } })
    .then(function (user) {
      if (!user || !user.correctPassword(password)) done(null, false);
      else done(null, user);
    })
    .catch(done);
  };

  passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, strategyFn));

  // ROUTE: POST /login to handle login
  app.post('/login', function (req, res, next) {
    const authCb = function (err, user) {

      if (err) return next(err);

      if (!user) {
        const error = new Error('Invalid login credentials.');
        error.status = 401;
        return next(error);
      }

      // establish session
      req.logIn(user, function (loginErr) {
        if (loginErr) return next(loginErr);
        // Respond with a response object that has user with _id and email.
        res.status(200).send({ user: user.sanitize() });
      });

    };

    passport.authenticate('local', authCb)(req, res, next);
  });

};
