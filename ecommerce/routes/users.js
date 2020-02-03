const path = require('path');
const util = require('util');
const express = require('express'); 
const passport = require('passport'); 
const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy; 
const usersModel= require('../models/users-superagent');
const { attachUserToCart } = require('../helpers/cookie-cart');

const router = express.Router();

const debug = require('debug')('ecommerce:router-users'); 
const error = require('debug')('ecommerce:error-users');

router.get('/', ensureAuthenticated, ensurePermissions,async (req, res, next) => {
    try {
        const users = await usersModel.listUsers();
        res.render('user/list', { 
            users,
            title: 'Users', 
            cart: req.session.cart,
            user: req.user ? req.user : undefined
         });
    } catch (e) { next(e); }
});

router.get('/register', (req, res, next) => {
    try {
        if (req.user) {
            res.redirect('/');
        }
        res.render('user/register', { title: "Register to SimpleStore", user: req.user, cart: req.session.cart }); 
    } catch (e) { next(e); }
});

router.post('/register', async (req, res, next) => {
    try {
        if (req.user) { res.redirect('/'); }
        const username = req.body.username;
        // const user = await usersModel.find(username);
        // if (user) { res.redirect('/users/register'); }
        const password = req.body.password;
        const provider = req.body.provider;
        const familyName = req.body.familyName;
        const givenName = req.body.givenName;
        const middleName = req.body.middleName;
        let emails = req.body.emails;
        let photos = req.body.images;
        emails = emails ? emails.trim().split(' ') : [];
        photos = photos ? photos.trim().split(' ') : []; // assuming that images are actually links or smth
        await usersModel.create({username, password, provider,
            familyName, givenName, middleName, emails, photos});
        res.redirect('/');

    } catch (e) { next(e); }
});

router.get('/login', function(req, res, next) { 
    try {
        if (req.user) { res.redirect('/'); }
        res.render('user/login', { title: "Login to SimpleStore", user: req.user, cart: req.session.cart}); 
    } catch (e) { next(e); }
});

router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        try {
            req.session.cart = attachUserToCart(req.session.cart, req.user);
            res.redirect('/');
        } catch (e) {
            next(e)
        }
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
  }
);

router.get('/logout', function(req, res, next) { 
    try {
        req.session = null
        req.logout(); 
        res.redirect('/'); 
    } catch (e) { next(e); }
});

router.get('/find/:username',async function(req, res, next) { 
  try {
    const username = req.params.username;
    const user = await usersModel.find(username);
    res.json(user);
 } catch (e) { next(e); }
});

passport.use(new LocalStrategy( 
    async (username, password, done) => { 
        try {
            const check = await usersModel.userPasswordCheck(username, 
            password);
            if (check.check) { 
                const user = await usersModel.find(username);
                const role = user.role;
                console.log(role === 'ROLE_ADMIN')
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

function ensureAuthenticated(req, res, next) { 
    try {
        // req.user is set by Passport in the deserialize function 
        if (req.user) next(); 
        // else res.redirect('/users/login'); 
        else throw 'Unauthorized';
    } catch (e) { next(e); }
}
 
module.exports.ensureAuthenticated = ensureAuthenticated;

function ensurePermissions(req, res, next) {
    try {
        if (req.user && req.user.role === 'ROLE_ADMIN') next();
        else res.send('Unauthorized');
    } catch (e) { next(e); }
}

module.exports.ensurePermissions = ensurePermissions;

module.exports.usersRouter = router;