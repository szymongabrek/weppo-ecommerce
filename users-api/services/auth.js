const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne(
      { where: { username: username }}
    ).then(user => {
      if (!user) return done(null, false);
      user.verifyPassword(password)
      .then( result => {
        if (!result) return done(null, false);
        return done(null, user);
      })
    }).catch(err => {
      return done(err);
    });
  }
));

exports.authLocal = passport.authenticate('local', {
  session: false
});