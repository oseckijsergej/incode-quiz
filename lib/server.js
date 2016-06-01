var debug = require('debug')('sdo:server');
var http = require('http');
var config = require('config');
/**
 * Get port from environment and store in Express.
 */

var port = config.get('port');

module.exports = function (app) {
    app.set('port', port);

    /**
     * Create HTTP server.
     */

    app.server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    app.server.listen(port);
    app.server.on('error', onError);
    app.server.on('listening', onListening);

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        var addr = app.server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
}