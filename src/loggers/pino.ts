// "multi-write-stream": "^2.0.1",
// "pino": "^5.4.1",
// "pino-pretty": "^2.1.0",

import { createWriteStream } from 'fs';
import _ from 'the-lodash';

import * as Pino from 'pino';

import * as PinoMultiStream from 'pino-multi-stream';

import { Options } from '../options';
import { BaseLogger } from '../base';
import { ILogger, ILoggerFunc } from '../ilogger';
import { RootLogger } from '../root';

// const BaseLogger = require('../base');
// const Pino = require('pino');
// const PinoMultiStream = require('pino-multi-stream').multistream;

class PinoLogger extends BaseLogger implements ILogger
{
    private _log : Pino.Logger = null;
    private _options : Options = {};

    constructor(root: RootLogger, name: string)
    {
        super(root, name, {
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
        var pinoOptions : Pino.LoggerOptions = {
            name: this.name
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
            var logFileStream = createWriteStream(this._logFile);
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
        this._log.error
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

export { PinoLogger }
