var Account = require('../models/account');
module.exports = {
    index: function (req, res, next) {
        res.render('admin/index');
    },
    list: function (req, res, next) {
        return Account.find(function (err, accounts) {
            if (!err) {
                return res.send(accounts);
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({error: 'Server error'});
            }
        });
    },
    create: function (req, res, next) {
        var account = new Account({
            login: req.param('login')
        });
        account.save(function (err, account) {
                if (!err) {
                    log.info("account created");
                    return res.send({status: 'OK', account: account});
                } else {
                    console.log(err);
                    if (err.name == 'ValidationError') {
                        res.statusCode = 400;
                        res.send({error: 'Validation error'});
                    } else {
                        res.statusCode = 500;
                        res.send({error: 'Server error'});
                    }
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                }
            }
        );
    },
    show: function (req, res, next) {
        return Account.findById(req.params.id, function (err, account) {
            if (!account) {
                res.statusCode = 404;
                return res.send({error: 'Not found'});
            }
            if (!err) {
                return res.send({status: 'OK', account: account});
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({error: 'Server error'});
            }
        });
    },
    edit: function (req, res, next) {
        return Account.findById(req.params.id, function (err, account) {
            if (!account) {
                res.statusCode = 404;
                return res.send({error: 'Not found'});
            }

            account.login = req.body.login;
            return account.save(function (err) {
                if (!err) {
                    log.info("article updated");
                    return res.send({status: 'OK', account: account});
                } else {
                    if (err.name == 'ValidationError') {
                        res.statusCode = 400;
                        res.send({error: 'Validation error'});
                    } else {
                        res.statusCode = 500;
                        res.send({error: 'Server error'});
                    }
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                }
            });
        });

    },
    delete: function (req, res, next) {
        return Account.findById(req.params.id, function (err, account) {
            if(!account) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }
            return account.remove(function (err) {
                if (!err) {
                    log.info("account removed");
                    return res.send({ status: 'OK' });
                } else {
                    res.statusCode = 500;
                    log.error('Internal error(%d): %s',res.statusCode,err.message);
                    return res.send({ error: 'Server error' });
                }
            });
        });
    }
};