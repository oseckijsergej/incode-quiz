var config = require('config');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var connection = mongoose.createConnection(config.get('mongoose:uri'), config.get('mongoose:options'));

var sessionStore = new MongoStore({ mongooseConnection: connection });

module.exports = sessionStore;