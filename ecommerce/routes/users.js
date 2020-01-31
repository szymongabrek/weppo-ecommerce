const path = require('path');
const util = require('util');
const express = require('express'); 
const passport = require('passport'); 
const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy; 
const usersModel= require('../models/users-superagent');

const router = express.Router();

const debug = require('debug')('ecommerce:router-users'); 
const error = require('debug')('ecommerce:error-users'); 

router.get('/login', function(req, res, next) { 
  try {
    res.render('user/login', { title: "Login to SimpleStore", user: req.user, }); 
  } catch (e) { next(e); }
});

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    try {
      res.redirect('/');

    } catch (e) {
      next(e)
    }
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
  });


router.get('/logout', function(req, res, next) { 
  try {
    req.session = null
    req.logout(); 
    res.redirect('/'); 
 } catch (e) { next(e); }
});

passport.use(new LocalStrategy( 
  async (username, password, done) => { 
    try {
      const check = await usersModel.userPasswordCheck(username, 
      password);
      if (check.check) { 
        done(null, { id: check.username, username: check.username }); 
      } else { 
        done(null, false, check.message); 
      } 
    } catch (e) { done(e); }
  } 
)); 

passport.serializeUser(function(user, done) { 
  try {
    done(null, user.username); 
  } catch (e) { done(e); }
}); 
 
passport.deserializeUser(async (username, done) => { 
  try {
    const user = await usersModel.find(username);
    done(null, user);
  } catch(e) { done(e); }
}); 

module.exports.initPassport = function initPassport(app) { 
  app.use(passport.initialize()); 
  app.use(passport.session()); 
}
 
module.exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) { 
  try {
    // req.user is set by Passport in the deserialize function 
    if (req.user) next(); 
    else res.redirect('/users/login'); 
  } catch (e) { next(e); }
}

module.exports.usersRouter = router;