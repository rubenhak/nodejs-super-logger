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
    [LogLevel.silly]: 'trace',
};

class PinoLogger extends BaseLogger implements ILogger {
    private _log?: Pino.Logger;

    constructor(root: RootLogger, name: string) {
        super(root, name);
    }

    get logger(): Pino.Logger {
        return this._log!;
    }

    close() {}

    _getLevel(level: LogLevel): string {
        return LEVEL_DICT[level];
    }

    _implInit() {
        var myLevel = this._getLevel(this.level);

        var pinoOptions: Pino.LoggerOptions = {
            name: this.name,
            level: myLevel,
        };

        var outputStreamList: any[] = [];

        if (this.options.pretty) {
            const PinoPretty = require('pino-pretty');
            const PinoGetPrettyStream = require('pino/lib/tools').getPrettyStream;
            var prettyStream = PinoGetPrettyStream(
                {
                    levelFirst: false,
                    translateTime: true,
                    colorize: true,
                },
                PinoPretty,
                process.stdout,
            );
            outputStreamList.push({ level: myLevel, stream: prettyStream });
        } else {
            outputStreamList.push({ level: myLevel, stream: process.stdout });
        }
        process.stdout.setMaxListeners(process.stdout.getMaxListeners() + 1);

        if (this._logFile) {
            var streamOptions = {
                flags: 'a',
            };
            var logFileStream = createWriteStream(this._logFile, streamOptions);
            outputStreamList.push({ level: myLevel, stream: logFileStream });
        }

        var myMultiStream = PinoMultiStream.multistream(outputStreamList);
        this._log = Pino(pinoOptions, myMultiStream);
    }

    exception(error: Error): void {
        this.error('*** EXCEPTION HAPPENED ***', error);
    }

    error(msg: string, ...args: any[]): void {
        this._executeLog(LogLevel.error, msg, ...args);
    }

    warn(msg: string, ...args: any[]): void {
        this._executeLog(LogLevel.warn, msg, ...args);
    }

    info(msg: string, ...args: any[]): void {
        this._executeLog(LogLevel.info, msg, ...args);
    }

    verbose(msg: string, ...args: any[]): void {
        this._executeLog(LogLevel.verbose, msg, ...args);
    }

    debug(msg: string, ...args: any[]): void {
        this._executeLog(LogLevel.debug, msg, ...args);
    }

    silly(msg: string, ...args: any[]): void {
        this._executeLog(LogLevel.silly, msg, ...args);
    }

    _executeLog(level: LogLevel, msg: string, ...args: any[]) {
        var xlevel = this._getLevel(level);
        var handler = this.logger[xlevel];
        if (handler.name == 'noop') {
            return;
        }
        var mergingObj: Record<string, any> = {};
        if (args.length > 0) {
            var count = (msg.match(/%s|%d|%O|%o|%j/g) || []).length;

            var formatArgs = _.take(args, count);
            var objArgs = _.drop(args, count);
            for (let i in objArgs) {
                var obj = objArgs[i];
                if (obj instanceof Error) {
                    msg += ' %s';
                    formatArgs.push(obj.stack);
                } else {
                    mergingObj[`arg${i}`] = obj;
                }
            }

            args = formatArgs;

            for (let i = 0; i < args.length; i++) {
                let val = args[i];
                if (val instanceof Error) {
                    mergingObj[`arg${_.keys(mergingObj).length}`] = 'Error: ' + val.message;
                    args[i] = val.stack;
                }
            }
        }
        // console.log('mergingObj: ', mergingObj)
        // console.log('args: ', args)
        handler.call(this._log, mergingObj, msg, ...args);
    }

    flush() {
        this.logger.flush();
    }
}

export { PinoLogger };
