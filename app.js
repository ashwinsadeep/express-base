/**
 * @author: Ashwin
 * Main worker module which creates the express app and starts listening on the provided socket
 */
(function (module) {

    var express = require('express');
    var HelperCommon = require('./helper/common');
    var Logger = require('./helper/logger');
    var BootStrap = require('./controllers/bootstrap');

    var App = function (port) {
        var self = this;
        self._port = port;
        self._app = express();
        self._app.use(HelperCommon.readClientParams);
        BootStrap.loadRoutingTable(self._app);
    };

    App.prototype.start = function () {
        try {
            this._server = this._app.listen(this._port);
            this._server.maxConnections = 2;
        } catch (e) {
            Logger.message('Something went wrong while starting app').setErrorInfo(e).critical();
        }
    };

    module.exports = App;

}(module));