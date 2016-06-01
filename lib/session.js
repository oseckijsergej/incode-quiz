var config = require('config');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Account = require('../models/account');

module.exports = function (app) {

    passport.use(new LocalStrategy({usernameField: 'login'}, function (login, password, done) {
        Account.authenticate(login, password, function (err, account) {
            return done(err, account)
        })
    }));
    passport.serializeUser(function (account, done) {
        done(null, account.id)
    });
    passport.deserializeUser(function (id, done) {
        Account.findById(id, function (err, account) {
            done(err, account)
        })
    });

    app.use(session({
        secret: config.get('session:secret'),
        key: config.get('session:key'),
        cookie: config.get('session:cookie'),
        store: require('./sessionStore'),
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function (req, res, next) {
        req.account = res.locals.account = null;

        if (!req.session.account) return next();

        User.findById(req.session.account, function (err, account) {
            if (err) return next(err);

            req.account = res.locals.account = account;
            next();
        });
    });
}