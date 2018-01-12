const _ = require('lodash');
const bunyan = require('bunyan');
const BaseLogger = require('../base');

class BunyanLogger extends BaseLogger
{
    constructor(root)
    {
        super(root, {
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
                    var obj = dataList[i];
                    if (obj instanceof Error) {
                        args.push(obj);
                    } else {
                        data['arg' + i] = obj;
                    }
                }
                if (_.keys(data).length > 0) {
                    args.unshift(data);
                }
            }
        }
        // console.log(JSON.stringify(args, null, 2));
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
