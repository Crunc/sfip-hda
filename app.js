var express = require('express');
var consolidate = require('consolidate');
var path = require('path');

var app = express();

// all environments
app.set('ipaddress', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);

app.engine('html', consolidate.swig); // assign the swig engine to .html files
app.set('view engine', 'html'); // set .html as the default extension
app.set('views', path.join(__dirname, 'views'));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// setup routes
require('./router')(app);

module.exports = app;
