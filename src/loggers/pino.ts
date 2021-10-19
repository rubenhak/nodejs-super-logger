import { createWriteStream } from 'fs';
import _ from 'the-lodash';

import Pino from 'pino'
import PinoMultiStream = require('pino-multi-stream');
import { PrettyOptions } from 'pino-pretty';

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
        const myLevel = this._getLevel(this.level);

        const pinoOptions: Pino.LoggerOptions = {
            name: this.name,
            level: myLevel,
        };

        const outputStreamList: any[] = [];

        if (this.options.pretty) {

            const prettyOptions: PrettyOptions = {
                levelFirst: false,
                translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                ignore: 'pid,hostname',
            }
            const prettyStream = 
                PinoMultiStream.prettyStream(
                    {
                        prettyPrint: prettyOptions           
                    }
                );
            outputStreamList.push({ level: myLevel, stream: prettyStream });
        } else {
            outputStreamList.push({ level: myLevel, stream: process.stdout });
        }
        process.stdout.setMaxListeners(process.stdout.getMaxListeners() + 1);

        if (this._logFile) {
            const streamOptions = {
                flags: 'a',
            };
            const logFileStream = createWriteStream(this._logFile, streamOptions);
            outputStreamList.push({ level: myLevel, stream: logFileStream });
        }

        const myMultiStream = PinoMultiStream.multistream(outputStreamList);
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

    private _executeLog(level: LogLevel, msg: string, ...args: any[]) {
        const xlevel = this._getLevel(level);
        const handler = this.logger[xlevel];
        if (handler.name == 'noop') {
            return;
        }
        const mergingObj: Record<string, any> = {};
        if (args.length > 0) {
            const count = (msg.match(/%s|%d|%O|%o|%j/g) || []).length;

            const formatArgs = _.take(args, count);
            const objArgs = _.drop(args, count);
            for (let i in objArgs) {
                const obj = objArgs[i];
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
        handler.call(this._log, mergingObj, msg, ...args);
    }

    flush() {
        this.logger.flush();
    }
}

export { PinoLogger };
