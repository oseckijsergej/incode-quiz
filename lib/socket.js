var log = require('lib/log')(module);
var config = require('config');
var connect = require('connect'); // npm i connect
var async = require('async');
var cookie = require('cookie');   // npm i cookie
var sessionStore = require('lib/sessionStore');
var HttpError = require('error').HttpError;
var Account = require('models/account');



module.exports = function (app) {
    function loadSession(sid, callback) {

        // sessionStore callback is not quite async-style!
        sessionStore.load(sid, function (err, session) {
            if (arguments.length == 0) {
                // no arguments => no session
                return callback(null, null);
            } else {
                return callback(null, session);
            }
        });

    }

    function loadAccount(session, callback) {

        log.debug("retrieving user ", session.passport.user);

        Account.findById(session.passport.user, function (err, account) {
            if (err) return callback(err);

            if (!account) {
                return callback(null, null);
            }
            //log.debug("account findbyId result: " + account);
            callback(null, account);
        });

    }

    var io = require('socket.io')(app.server);

    //io.set('origins', 'localhost:*');
    io.set('logger', log);
    io.use(function (socket, next) {
        async.waterfall([
            function (next) {
                // сделать handshakeData.cookies - объектом с cookie
                socket.cookies = cookie.parse(socket.request.headers.cookie || '');
                var sidCookie = socket.cookies[config.get('session:key')];
                var sid = connect.utils.parseSignedCookie(sidCookie, config.get('session:secret'));

                loadSession(sid, next);
            },
            function (session, next) {

                if (!session) {
                    callback(new HttpError(401, "No session"));
                }

                socket.session = session;
                loadAccount(session, next);
            },
            function (account, next) {
                if (!account) {
                    next(new HttpError(403, "Anonymous session may not connect"));
                }

                socket.account = account;
                next();
            }

        ], function (err) {
            if (!err) {
                return next(null, true);
            }

            if (err instanceof HttpError) {
                return next(null, false);
            }

            next(err);
        });

    });

    io.on('connection', function (socket) {
        var socketChat = require('./socketChat')(socket);

        socket.on('room:create', socketChat.roomCreate);
        socket.on('room:get', socketChat.roomGet);
        socket.on('room:update', socketChat.roomUpdate);
        socket.on('room:delete', socketChat.roomDelete);
        socket.on('account:get', socketChat.accountGet);
        socket.on('message:create', socketChat.messageCreate);
        socket.on('message:get', socketChat.messageGet);

    });
};
