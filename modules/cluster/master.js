/**
 * @author: Ashwin
 * Cluster master which handles the process lifecycle of the workers and respond to external signals
 */
(function (module) {

    var WORKER_MAX_TIME_TO_COME_ONLINE = 5000;

    var Logger = require('../../helper/logger');
    var CPUS = require('os').cpus().length;

    /**
     * Constructor will also subscribe to various events from the workers to manage their lifercycle appropriately
     * @param cluster instance of node cluster
     * @param appName name of the app - this will be used when naming processes
     * @constructor
     */
    var Master = function (cluster, appName) {
        var self = this;
        self._cluster = cluster;
        self._appName = appName;
        self._registerWorkerEventListeners();
        self._registerProcessEventListener();
    };

    /**
     * Register event listeners to manage woker lifecycles.
     * Handles each events, log appropriately, and spawn new workers when required
     * @private
     */
    Master.prototype._registerWorkerEventListeners = function () {
        var self = this;
        var workerTimeouts = [];
        // Register timeout to kill the worker if it is not coming up within a reasonable amount of time
        self._cluster.on('fork', function (worker) {
            workerTimeouts[worker.id] = setTimeout(function () {
                self._log('Failed to start worker', {pid: worker.process.pid});
                self.killWorker(worker);
            }, WORKER_MAX_TIME_TO_COME_ONLINE);
        });

        // Worker is up. Invalidate the timeout so that it doesn't get killed
        self._cluster.on('listening', function (worker, address) {
            clearTimeout(workerTimeouts[worker.id]);
            self._log('Worker has started listening', {pid: worker.process.pid}, false);
        });

        // Worker is exiting. Inavlidate timeout (if exists) and log exit code
        self._cluster.on('exit', function (worker, code, signal) {
            var debugData = {
                exit_code: code,
                signal   : signal,
                pid      : worker.process.pid
            };
            self._log('Worker exited with code.', debugData);
            clearTimeout(workerTimeouts[worker.id]);
        });
    };

    /**
     * Register event listeners to handle master lifecycle. For eg. kill workers on SIGINT
     * @private
     */
    Master.prototype._registerProcessEventListener = function () {
        var self = this;
        // Kill workers on SIGINT
        process.on('SIGINT', function () {
            for (var workerId in self._cluster.workers) {
                self.killWorker(self._cluster.workers[workerId]);
            }
        });
    };

    Master.prototype.forkWorkers = function () {
        var self = this;
        process.title = 'm-' + self._appName;
        for (var i = 0; i < CPUS; i++) {
            self._cluster.fork();
        }
    };

    Master.prototype.killWorker = function (worker) {
        var self = this;
        self._log('Killing worker', {pid: worker.process.pid});
        worker.kill();
    };

    Master.prototype._log = function (msg, debugInfo, isCritical) {
        if (isCritical) {
            Logger.message(msg).setFile('cluster.log').setDebugInfo(debugInfo).critical();
        } else {
            Logger.message(msg).setFile('cluster.log').setDebugInfo(debugInfo).info();
        }
    };

    module.exports = Master;

})(module);