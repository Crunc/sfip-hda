var http = require('http');
var app = require('./app');

var terminator = function (sig) {
    if (typeof sig === "string") {
        console.log('%s: Received %s - terminating sample app ...', Date(Date.now()), sig);
        process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()));
};

//  Process on exit and signals.
process.on('exit', function () {
    terminator();
});

// Removed 'SIGPIPE' from the list - bugz 852598.
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function (element, index, array) {
        process.on(element, function () {
            terminator(element);
        });
    });

http.createServer(app).listen(app.get('port'), app.get('ipaddress'), function () {
    console.log('Express server listening on ' + app.get('ipaddress') + ':' + app.get('port'));
});