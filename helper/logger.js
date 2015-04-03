/**
 * @Author: Ashwin
 */
(function (module) {
    //var CommonLib = require('../../../cm_modules/common');
    //var Moment = require('moment');

    const LOG_LEVEL = {
        CRITICAL: 'critical',
        DEBUG   : 'debug',
        INFO    : 'info'
    };

    var Logger = function (filename) {
        this._app_name = 'app';
        this._filename = filename;
        //this._logger = new CommonLib.FileWriter(filename);
    };

    /**
     * Factory method to generate a logger. It'll return an object of the logger which you can call other methods on
     * @param msg - message to log
     * @param level - log level - critical, info, debug
     */
    Logger.message = function (msg) {
        var filename = 'monitor.log';
        var obj = new Logger(filename);
        obj._msg = msg;
        obj._is_sync = false;
        return obj;
    };

    Logger.prototype.setUserId = function (userId) {
        this._userId = userId;
        return this;
    };

    Logger.prototype.setFile = function (filename) {
        this._filename = filename;
        return this;
    };

    /**
     * Set any debug info.
     * @param debugInfo Mixed type. Will be bound to debug_info key in the logged json
     */
    Logger.prototype.setDebugInfo = function (debugInfo) {
        this._debugInfo = debugInfo;
        return this;
    };

    Logger.prototype.setErrorInfo = function (error) {
        this._errorObject = error;
        return this;
    };

    Logger.prototype.setIsSync = function () {
        this._is_sync = true;
        return this;
    };

    /**
     * Format the data and write to log file
     */
    Logger.prototype._write = function (logData) {
        console.log(logData);
        //if (this._is_sync){
        //    this._logger.writeSync(logData);
        //} else{
        //    this._logger.write(logData);
        //}
    };

    Logger.prototype.critical = function () {
        this._level = LOG_LEVEL.CRITICAL;
        var logData = this._formLogData();
        this._write(logData);
    };

    Logger.prototype.info = function () {
        this._level = LOG_LEVEL.INFO;
        var logData = this._formLogData();
        this._write(logData);
    };

    Logger.prototype.debug = function () {
        this._level = LOG_LEVEL.DEBUG;
        var logData = this._formLogData();
        this._write(logData);
    };

    Logger.prototype._formLogData = function () {
        var logData = {
            'message'   : this._msg,
            'category'  : this._level,
            'debug_info': this._debugInfo,
            'app_name'  : this._app_name,
            //'timestamp'      : Moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            'user_id'   : this._userId
        };
        var stack = this._errorObject ? this._errorObject.stack : null;
        logData.exception = this._processStack(stack);
        if (this._errorObject) {
            var innerException = this._errorObject.getInnerException ? this._errorObject.getInnerException() : null;
            logData.inner_exception = innerException ? this._processStack(innerException.stack) : null;
        }

        return logData;
    };

    Logger.prototype._processStack = function (stack) {
        var sliceCount = 1;
        var currentStack = stack;
        if (currentStack == null) {
            currentStack = (new Error()).stack;
            sliceCount = 4;
        }

        var data = {};
        data.stack = currentStack.split('\n').slice(sliceCount);

        // Stack trace format :
        // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
        var s = data.stack[0], sp = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
                .exec(s)
            || /at\s+()(.*):(\d*):(\d*)/gi.exec(s);
        if (sp && sp.length === 5) {
            data.method = sp[1];
            data.path = sp[2];
            data.line = sp[3];
            data.pos = sp[4];
            var paths = data.path.split('/');
            data.file = paths[paths.length - 1];
        }

        return data;
    };

    module.exports = Logger;

})(module);
