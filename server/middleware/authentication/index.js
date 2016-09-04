'use strict';
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

module.exports = function (app, db) {

  const dbStore = new SequelizeStore({
    db: db
  });

  const User = db.model('User');

  dbStore.sync();

  app.use(session({
    secret: app.getValue('env').SESSION_SECRET,
    store: dbStore,
    resave: false,
    saveUninitialized: false
  }));

  // Initialize passport and also allow it to read the request session information.
  app.use(passport.initialize());
  app.use(passport.session());

  // Send cookie: userId, encrypted with secret
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Receive cookie: use id to set req.user to a user found in the database.
  passport.deserializeUser(function (id, done) {
    User.findById(id)
    .then(user => done(null, user))
    .catch(done);
  });

  // ROUTE: GET /session to retrieve session information directly
  //Used by the browser application (Angular) to determine if a user is logged in already.
  app.get('/session', function (req, res) {
    if (req.user) res.send({ user: req.user.sanitize() });
    else res.status(401).send('No authenticated user.');
  });

  // ROUTE: GET /logout for logout process.
  app.get('/logout', function (req, res) {
    req.logout();
    res.status(200).end();
  });

  // Register local login strategy
  require('./local')(app, db);

};
