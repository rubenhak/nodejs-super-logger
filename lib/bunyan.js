const _ = require('lodash');
const bunyan = require('bunyan');
const BaseLogger = require('./base');

class BunyanLogger extends BaseLogger
{
    constructor(name, enableFileOutput)
    {
        super(name, enableFileOutput, {
            'error' : 'error',
            'warn' : 'warn',
            'info' : 'info',
            'verbose' : 'debug',
            'debug' : 'debug',
            'silly' : 'trace'
        });
    }

    _init()
    {
        this._log = bunyan.createLogger({name: this._name});
    }

    _setLevel(level)
    {
        this._log.level(level);
    }

    _executeLog(level, args)
    {
        if (args.length > 0) {
            if (_.isString(args[0])) {
                var count = (args[0].match(/%s/g) || []).length;
                var dataList = args.splice(count + 1);
                var data = {};
                for(var i in dataList) {
                    data['arg' + i] = dataList[i];
                }
                args.unshift(data);
            }
        }
        this._log[level].apply(this._log, args);
    }

    _setupFileStream(logFile)
    {
        this._log.addStream({
            path: logFile
        });
    }
}

module.exports = BunyanLogger;
