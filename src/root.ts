
import { existsSync as fsExistsSync, mkdirSync as fsMkdirSync } from 'fs';
import * as del from 'delete';

import { ILogger, ILoggerFunc } from './ilogger';
import { Options } from './options';
import { PinoLogger } from './loggers/pino';

class RootLogger
{

    private _subloggers : Record<string, PinoLogger> = {};
    private _rootLogger : ILogger;
    private _rootOptions : Options;
    private _rootDir: string | null = null;

    constructor(name: string, options?: Options)
    {
        if (options) {
            this._rootOptions = options;    
        } else {
            this._rootOptions = new Options();
        }

        this._setupOutputDir();

        this._rootLogger = this.sublogger(name);
    }

    _setupOutputDir()
    {
        if (!this._rootOptions.enableFile) {
            return;
        }

        var dir = 'logs';
        if (this._rootOptions.path) {
            dir = this._rootOptions.path;
        }
        if (this._rootOptions.cleanOnStart) {
            var toDelete = dir + '/*';
            del.sync([toDelete]);
        }
        if (!fsExistsSync(dir)) {
            fsMkdirSync(dir);
        }
        this._rootDir = dir;
    }

    get rootDir() {
        return this._rootDir;
    }

    get logger() {
        return this._rootLogger;
    }

    get options() : Options {
        return this._rootOptions;
    }

    sublogger(name: string) : ILogger
    {
        if (name in this._subloggers) {
            return this._subloggers[name];
        }

        var logger = this._create(name);

        this._subloggers[name] = logger;

        return logger;
    }

    _create(name: string) : PinoLogger
    {
        var logger = new PinoLogger(this, name);
        logger.setup(this._rootOptions);
        logger.level = this._rootOptions.level;
        return logger;
    }

}


export { RootLogger };
