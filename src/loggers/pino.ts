import { createWriteStream } from 'fs';
import _ from 'the-lodash';

import Pino = require('pino');
import PinoMultiStream = require('pino-multi-stream');

import { BaseLogger } from '../base';
import { ILogger, ILoggerFunc } from '../ilogger';
import { RootLogger } from '../root';
import { LogLevel } from '../levels';


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

    get logger() : Pino.Logger {
        return this._log!;
    }

    _getLevel(level: LogLevel) : string {
        return LEVEL_DICT[level];
    }

    _implInit()
    {
        var myLevel = this._getLevel(this.level);

        var pinoOptions : Pino.LoggerOptions = {
            name: this.name,
            level: myLevel
        }

        console.log(`pinoOptions`, pinoOptions);


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
            outputStreamList.push({ level: myLevel, stream: prettyStream });
        }
        else
        {
            outputStreamList.push({ level: myLevel, stream: process.stdout });
        }
        process.stdout.setMaxListeners(process.stdout.getMaxListeners() + 1);

        if (this._logFile) {
            var logFileStream = createWriteStream(this._logFile);
            outputStreamList.push({ level: myLevel, stream: logFileStream });
        }

        var myMultiStream = PinoMultiStream.multistream(outputStreamList);
        this._log = Pino(pinoOptions, myMultiStream);
    }

    error(msg: string, ...args: any[]): void
    {
        this._executeLog(LogLevel.error, msg, ...args);
    }

    warn(msg: string, ...args: any[]): void
    {
        this._executeLog(LogLevel.warn, msg, ...args);
    }

    info(msg: string, ...args: any[]): void
    {
        this._executeLog(LogLevel.info, msg, ...args);
    }

    verbose(msg: string, ...args: any[]): void
    {
        this._executeLog(LogLevel.verbose, msg, ...args);
    }

    debug(msg: string, ...args: any[]): void
    {
        this._executeLog(LogLevel.debug, msg, ...args);
    }
    
    silly(msg: string, ...args: any[]): void
    {
        this._executeLog(LogLevel.silly, msg, ...args);
    }
    
    _executeLog(level: LogLevel, msg: string, ...args: any[])
    {
        var xlevel = this._getLevel(level);
        var handler = this.logger[xlevel];
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
        handler.call(this._log, {}, msg, ...args);
    }

    flush()
    {
        this.logger.flush()
    }
}

export { PinoLogger }
