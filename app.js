require('express-namespace');
var express = require('express');
var app = express();

app.set('root', __dirname);


require('lib/settings')(app);
require('lib/session')(app);
require('routes')(app);
require('lib/server')(app);
require('lib/socket')(app);