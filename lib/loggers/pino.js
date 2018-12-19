// "multi-write-stream": "^2.0.1",
// "pino": "^5.4.1",
// "pino-pretty": "^2.1.0",

const _ = require('the-lodash');
const BaseLogger = require('../base');
const fs = require('fs');
const Pino = require('pino');
const PinoMultiStream = require('pino-multi-stream').multistream;

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

        var outputStreamList = [];

        if (this._options.pretty) 
        {
            const PinoPretty = require('pino-pretty');
            const PinoGetPrettyStream = require('pino/lib/tools').getPrettyStream;
            var prettyStream = PinoGetPrettyStream({
                    levelFirst: false,
                    translateTime: true,
                    colorize: true
                },
                PinoPretty,
                process.stdout);
            outputStreamList.push(prettyStream);
        }
        else
        {
            outputStreamList.push(process.stdout);
        }
        process.stdout.setMaxListeners(process.stdout.getMaxListeners() + 1);

        if (this._logFile) {
            var logFileStream = fs.createWriteStream(this._logFile);
            outputStreamList.push(logFileStream);
        }

        var myMultiStream = PinoMultiStream(outputStreamList);
        this._log = Pino(pinoOptions, myMultiStream);
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
        var handler = this._log[level];
        if (handler.name == 'noop') {
            return;
        }
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
        handler.apply(this._log, args);
    }

    _setupFileStream(logFile)
    {
        // this._log.addStream({
        //     path: logFile
        // });
    }

    flush()
    {
        this._log.flush()
    }
}

module.exports = PinoLogger;
