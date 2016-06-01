var passport = require('passport');

var Account = require('../models/account');

module.exports = {
    show: function (req, res, next) {
        var render = function (account) {

            res.render('account/show', {
                account: account,
                logged: req.isAuthenticated()
            });
        };
        if (req.params.id) {
            Account.findOne({_id: req.params.id}, function (err, account) {
                if (err) {
                    throw err;
                }
                render(account);
            });
        } else {
            console.log(req.user);
            render(req.user);
        }
    },

    new: function (req, res, next) {
        res.render('account/new', {
            account: req.user,
            logged: req.isAuthenticated()
        });
    },

    loginForm: function (req, res, next) {
        res.render('account/loginForm', {
            account: req.user,
            logged: req.isAuthenticated()
        });
    },

    create: function (req, res, next) {
        var account = new Account({
            login: req.param('login'),
            email: req.param('email'),
            password: req.param('password')
        });
        account.save(function (err, account) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/account/' + account._id);
            }
        );
    },

    login: function (req, res, next) {
        passport.authenticate('local', function (err, account, info) {
            if (err) {
                return next(err);
            }

            // If failed return fail - needs improving
            if (!account) {
                return res.send({status: "fail"})
            }

            // Log in user using passport's log in function
            req.logIn(account, function (err) {
                if (err) {
                    return next(err);
                }

                // Redirect to homepage
                return res.redirect('/');
            });
        })(req, res, next);
    },

    logout: function (req, res, next) {
        req.logout();
        res.redirect('/');
    }
}



