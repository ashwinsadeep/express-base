/**
 * @author: Ashwin
 * Bootstrap module which is in charge of handling the routing for different API versions
 */
(function (module) {

    var SUPPORTED_VERSIONS = '/v[4|5|6]';
    var PREFIX = '/f';
    var enrouten = require('express-enrouten');

    var BootStrap = function () {
    };

    BootStrap.loadRoutingTable = function (express_app) {
        var self = this;
        self._app = express_app;

        // Load handlers for older versions from the corresponding directories
        self._app.use(PREFIX, enrouten({
            directory: './'
        }));

        // Load default handlers for all versions from vcommon
        self._app.use(PREFIX + SUPPORTED_VERSIONS, enrouten({
            directory: 'vcommon'
        }));
    };

    module.exports = BootStrap;

})(module);