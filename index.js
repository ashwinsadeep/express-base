/**
 * @author: Ashwin
 * Application entry point - This will start the master process which will spawn workers depending on machine configuration
 */
(function () {

    var cluster = require('cluster');
    var APP_NAME = 'app';
    var Master = require('./modules/cluster/master');
    var Logger = require('./helper/logger');

    var startMaster = function () {
        /**
         * Server level uncaught exception handler in case something is really wrong.
         * TODO - Replace this with domain and do not drop connections for currently connected clients
         */
        process.on('uncaughtException', function (err) {
            Logger.message('Could not start the server - ' + err.message).setErrorInfo(err).critical();
            process.exit(1);
        });

        var master = new Master(cluster, APP_NAME);
        master.forkWorkers();


    };

    var startWorkers = function () {
        /**
         * Worker level uncaught exception handler in case something is really wrong.
         * TODO - Replace this with domain and do not drop connections for currently connected clients
         */
        process.on('uncaughtException', function (err) {
            Logger.message('Could not start the app - ' + err.message).setErrorInfo(err).critical();
            process.exit(1);
        });

        process.title = 'w-' + APP_NAME;
        var App = require('./app');
        var app = new App(6543);
        app.start();
    };



    /**
     * This is the app invocation point.
     * Cluster will start the master process first which will spawn n number of workers,
     * where n is the number of CPU's in the current machine
     */
    if (cluster.isMaster) {
        startMaster();
    } else {
        startWorkers();
    }

})();