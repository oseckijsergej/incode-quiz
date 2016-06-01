var path = require('path');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('../config');

var favicon = require('serve-favicon');
module.exports = function (app) {
    app.set('views', path.join(app.get('root'), 'views'));
    app.set('view engine', 'jade');
    //app.use(favicon(path.join(app.get('root'), 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(require('less-middleware')(path.join(app.get('root'), 'public')));
    app.use(express.static(path.join(app.get('root'), 'public')));
}