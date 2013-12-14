
/**
 * Module dependencies.
 */

var express = require('express');
var consolidate = require('consolidate');
var http = require('http');
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

var terminator = function(sig){
    if (typeof sig === "string") {
        console.log('%s: Received %s - terminating sample app ...', Date(Date.now()), sig);
        process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
};

//  Process on exit and signals.
process.on('exit', function() { terminator(); });

// Removed 'SIGPIPE' from the list - bugz 852598.
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function(element, index, array) {
        process.on(element, function() { terminator(element); });
    });

http.createServer(app).listen(app.get('port'), app.get('ipaddress'), function(){
  console.log('Express server listening on ' + app.get('ipaddress') + ':' + app.get('port'));
});
