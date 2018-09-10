// "multi-write-stream": "^2.0.1",
// "pino": "^5.4.1",
// "pino-pretty": "^2.1.0",

const _ = require('the-lodash');
const Pino = require('pino');
const BaseLogger = require('../base');
const multi = require('multi-write-stream');
const fs = require('fs');

class PinoLogger extends BaseLogger
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
        var pinoOptions = {
            name: this._name
        }

        if (this._options.pretty) {
            pinoOptions.prettyPrint = {
                levelFirst: false,
                translateTime: true
                // colorize: true
            }
            pinoOptions.prettifier = require('pino-pretty')
        }

        if (this._logFile) {
            this._log = Pino(pinoOptions, this._getOutputStream());
        } else {
            this._log = Pino(pinoOptions);
        }
    }

    _getOutputStream() {
        var logFileStream = fs.createWriteStream(this._logFile);
        var stream = multi([
            process.stdout,
            logFileStream
        ])
        process.stdout.setMaxListeners(process.stdout.getMaxListeners() + 1);
        return stream;
    }

    _setLevel(level)
    {
        if (!this._log) {
            return;
        }
        this._log.level = level;
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
            for(var i = 0; i < args.length; i++) {
                if (args[i] instanceof Error) {
                    args[i] = args[i].stack
                }
            }
        }
        this._log[level].apply(this._log, args);
    }

    _setupFileStream(logFile)
    {
        // this._log.addStream({
        //     path: logFile
        // });
    }
}

module.exports = PinoLogger;
