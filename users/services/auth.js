const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      let user = await User.findOne({ where: {username}});
      if (!user) return done(null, false);
      let verified = await user.verifyPassword(password);
      if (!verified) return done(null, false);
      return done(null, user);
    } catch(err) {
      return done(null, false);
    }
  }
));

exports.authLocal = passport.authenticate('local', {
  session: false
});