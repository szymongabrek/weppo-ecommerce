import path from 'path';
const util = require('util');
const express = require('express'); 
const passport = require('passport'); 
const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy; 
const usersModel= require('../models/users-superagent');
const { sessionCookieName } = require('../app');

const router = express.Router();

const debug = require('debug')('ecommerce:router-users'); 
const error = require('debug')('ecommerce:error-users'); 

router.get('/login', function(req, res, next) { 
  try {
    res.render('login', { title: "Login to SimpleStore", user: req.user, }); 
  } catch (e) { next(e); }
}); 
 
router.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/', // SUCCESS: Go to home page 
    failureRedirect: 'login', // FAIL: Go to /user/login 
  }) 
);

module.exports = router;