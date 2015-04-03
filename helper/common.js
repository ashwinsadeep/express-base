/**
 * @Author: Ashwin
 * Helper functions used throughout the app will go here. Do not use this as an object. All methods should be static
 */

(function (module) {

    var HelperCommon = function () {

    };

    /**
     * Express middleware to read client params and attach it to the request object
     * @param req
     * @param res
     * @param next
     */
    HelperCommon.readClientParams = function (req, res, next) {
        var clientParams = {
            'ct': req.query.ct,
            'cv': req.query.cv,
            'pv': req.query.pv
        };

        req.getClientParams = function () {
            return clientParams;
        };

        req.getClientType = function () {
            return clientParams['ct'];
        };

        req.getClientVersion = function () {
            return clientParams['cv'];
        };

        next();
    };

    module.exports = HelperCommon;

})(module);