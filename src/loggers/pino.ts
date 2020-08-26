// "multi-write-stream": "^2.0.1",
// "pino": "^5.4.1",
// "pino-pretty": "^2.1.0",

import { createWriteStream } from 'fs';
import _ from 'the-lodash';

import * as Pino from 'pino';

import * as PinoMultiStream from 'pino-multi-stream';

import { BaseLogger } from '../base';
import { ILogger, ILoggerFunc } from '../ilogger';
import { RootLogger } from '../root';
import { LogLevel } from '../levels';

// const BaseLogger = require('../base');
// const Pino = require('pino');
// const PinoMultiStream = require('pino-multi-stream').multistream;

const LEVEL_DICT = {
    [LogLevel.error]: 'error',
    [LogLevel.warn]: 'warn',
    [LogLevel.info]: 'info',
    [LogLevel.verbose]: 'debug',
    [LogLevel.debug]: 'debug',
    [LogLevel.silly]: 'trace'
}

class PinoLogger extends BaseLogger implements ILogger
{
    private _log? : Pino.Logger;

    constructor(root: RootLogger, name: string)
    {
        super(root, name); 
    }

    _getLevel(level: LogLevel) : string {
        return LEVEL_DICT[level];
    }

    _implInit()
    {
        var pinoOptions : Pino.LoggerOptions = {
            name: this.name
        }

        var outputStreamList : any[] = [];

        if (this.options.pretty) 
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

    _implSetLevel(level : LogLevel)
    {
        if (!this._log) {
            return;
        }
        this._log.level = this._getLevel(level);
    }

    error(msg: string, ...args: any[]): void
    {
        this._executeLog(LogLevel.error, msg, args);
    }

    warn(msg: string, ...args: any[]): void
    {
        this._executeLog(LogLevel.warn, msg, args);
    }

    info(msg: string, ...args: any[]): void
    {
        this._executeLog(LogLevel.info, msg, args);
    }

    verbose(msg: string, ...args: any[]): void
    {
        this._executeLog(LogLevel.verbose, msg, args);
    }

    debug(msg: string, ...args: any[]): void
    {
        this._executeLog(LogLevel.debug, msg, args);
    }
    
    silly(msg: string, ...args: any[]): void
    {
        this._executeLog(LogLevel.silly, msg, args);
    }
    
    _executeLog(level: LogLevel, msg: string, ...args: any[])
    {
        var xlevel = this._getLevel(level);
        var handler = this._log![xlevel];

        if (handler.name == 'noop') {
            return;
        }
        if (args.length > 0) {
            if (_.isString(args[0])) {
                var count = (args[0].match(/%s/g) || []).length;
                var dataList = args.splice(count + 1);
                var data : Record<string, any> = {};
                for(let i in dataList) {
                    var obj = dataList[i];
                    if (obj instanceof Error) {
                        args.push(obj);
                    } else {
                        data[`arg${i}`] = obj;
                    }
                }
                if (_.keys(data).length > 0) {
                    args.unshift(data);
                }
            }
            for(let i = 0; i < args.length; i++) {
                if (args[i] instanceof Error) {
                    args[i] = args[i].stack
                }
            }
        }
        // handler()
        // handler.apply(this._log, args);
    }

    flush()
    {
        this._log!.flush()
    }
}

export { PinoLogger }
